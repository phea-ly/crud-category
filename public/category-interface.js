const endpoint = '/api/categories';

const state = {
    categories: [],
    editingId: null,
};

const elements = {
    tableBody: document.getElementById('categoryTableBody'),
    alert: document.getElementById('pageAlert'),
    alertText: document.getElementById('pageAlertText'),
    alertTitle: document.getElementById('pageAlertTitle'),
    tableShell: document.getElementById('tableShell'),
    modal: document.getElementById('categoryModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalSubtitle: document.getElementById('modalSubtitle'),
    modalForm: document.getElementById('categoryForm'),
    categoryId: document.getElementById('categoryId'),
    categoryName: document.getElementById('categoryName'),
    categoryDescription: document.getElementById('categoryDescription'),
    categoryActive: document.getElementById('categoryActive'),
    openCreateBtn: document.getElementById('openCreateBtn'),
    saveBtn: document.getElementById('saveBtn'),
    tableCount: document.getElementById('tableCount'),
};

function setLoading(isLoading) {
    elements.tableShell.classList.toggle('is-loading', isLoading);
    elements.saveBtn.disabled = isLoading;
    elements.saveBtn.textContent = isLoading ? 'Saving...' : 'Save Category';
}

function showAlert(type, title, text) {
    elements.alert.className = `alert alert-${type} is-visible`;
    elements.alertTitle.textContent = title;
    elements.alertText.textContent = text;
}

function hideAlert() {
    elements.alert.className = 'alert';
    elements.alertTitle.textContent = '';
    elements.alertText.textContent = '';
}

function openModal(category = null) {
    state.editingId = category?.id ?? null;
    elements.modalTitle.textContent = category ? 'Update Category' : 'Add Category';
    elements.modalSubtitle.textContent = category
        ? 'Edit the category details and save the changes.'
        : 'Create a new category for the list.';
    elements.categoryId.value = category?.id ?? '';
    elements.categoryName.value = category?.name ?? '';
    elements.categoryDescription.value = category?.description ?? '';
    elements.categoryActive.checked = category?.is_active ?? true;
    elements.modal.classList.add('is-open');
    elements.modal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => elements.categoryName.focus(), 0);
}

function closeModal() {
    elements.modal.classList.remove('is-open');
    elements.modal.setAttribute('aria-hidden', 'true');
    elements.modalForm.reset();
    elements.categoryActive.checked = true;
    state.editingId = null;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function statusPill(isActive) {
    return `<span class="status-pill ${isActive ? 'is-active' : 'is-inactive'}">${
        isActive ? 'Active' : 'Inactive'
    }</span>`;
}

function renderCategories() {
    elements.tableCount.textContent = `${state.categories.length} total`;

    if (!state.categories.length) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <strong>No categories yet</strong>
                        <div>Use the Add Category button to create the first one.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    elements.tableBody.innerHTML = state.categories
        .map(
            (category) => `
            <tr>
                <td class="category-id">${category.id}</td>
                <td>${escapeHtml(category.name)}</td>
                <td class="category-desc">${escapeHtml(category.description ?? '') || '<span style="color:#94a3b8;">No description</span>'}</td>
                <td>${statusPill(Boolean(category.is_active))}</td>
                <td>
                    <div class="row-actions">
                        <button type="button" class="link-btn" data-edit-id="${category.id}">Edit</button>
                        <button type="button" class="link-btn" data-delete-id="${category.id}" style="color: var(--red);">Delete</button>
                    </div>
                </td>
            </tr>
        `
        )
        .join('');
}

async function loadCategories() {
    setLoading(true);

    try {
        const response = await fetch(endpoint, {
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Unable to load categories right now.');
        }

        state.categories = await response.json();
        renderCategories();
    } catch (error) {
        showAlert('error', 'Load failed', error.message);
    } finally {
        setLoading(false);
    }
}

async function saveCategory(event) {
    event.preventDefault();
    hideAlert();
    setLoading(true);

    const payload = {
        name: elements.categoryName.value.trim(),
        description: elements.categoryDescription.value.trim(),
        is_active: elements.categoryActive.checked,
    };

    const isEdit = Boolean(state.editingId);
    const url = isEdit ? `${endpoint}/${state.editingId}` : endpoint;

    try {
        const response = await fetch(url, {
            method: isEdit ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 422) {
            const validation = await response.json();
            const firstError = Object.values(validation.errors ?? {}).flat()[0] ?? 'Please check the form fields.';
            throw new Error(firstError);
        }

        if (!response.ok) {
            throw new Error('Could not save the category.');
        }

        showAlert('success', isEdit ? 'Category updated' : 'Category added', 'Your changes were saved successfully.');
        closeModal();
        await loadCategories();
    } catch (error) {
        showAlert('error', 'Save failed', error.message);
    } finally {
        setLoading(false);
    }
}

async function deleteCategory(id) {
    const selected = state.categories.find((category) => String(category.id) === String(id));
    const confirmed = window.confirm(`Delete "${selected?.name ?? 'this category'}"?`);

    if (!confirmed) {
        return;
    }

    hideAlert();
    setLoading(true);

    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Could not delete the category.');
        }

        showAlert('success', 'Category deleted', 'The category was removed successfully.');
        await loadCategories();
    } catch (error) {
        showAlert('error', 'Delete failed', error.message);
    } finally {
        setLoading(false);
    }
}

elements.openCreateBtn?.addEventListener('click', () => openModal());
elements.modalForm?.addEventListener('submit', saveCategory);

elements.modal?.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-modal]')) {
        closeModal();
    }
});

elements.tableBody?.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-id]');
    const deleteButton = event.target.closest('[data-delete-id]');

    if (editButton) {
        const category = state.categories.find((item) => String(item.id) === editButton.dataset.editId);
        if (category) {
            openModal(category);
        }
    }

    if (deleteButton) {
        deleteCategory(deleteButton.dataset.deleteId);
    }
});

loadCategories();
