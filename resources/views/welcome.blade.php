<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Category Manager</title>
        <link rel="stylesheet" href="{{ asset('category-interface.css') }}">
        <script src="{{ asset('category-interface.js') }}" defer></script>
    </head>
    <body>
        <div class="page-shell">
            <main class="page-inner">
                <section class="hero">
                    <div class="hero-copy">
                        <div class="eyebrow">Category dashboard</div>
                        <h1>List Category</h1>
                        <p>
                            Manage your categories from one clean screen. Add new items, update existing ones, and keep the list
                            active or inactive with a single toggle.
                        </p>
                    </div>

                    <div class="toolbar">
                        <button type="button" id="openCreateBtn" class="btn btn-primary">Add Category</button>
                    </div>
                </section>

                <section class="panel" id="tableShell">
                    <div class="panel-head">
                        <div>
                            <h2>Categories</h2>
                            <div class="meta" id="tableCount">0 total</div>
                        </div>
                        <div class="meta">Powered by the category API</div>
                    </div>

                    <div class="panel-body">
                        <div class="alert" id="pageAlert" role="status" aria-live="polite">
                            <div>
                                <strong id="pageAlertTitle"></strong>
                                <div id="pageAlertText"></div>
                            </div>
                        </div>

                        <div class="table-wrap">
                            <table class="category-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Is Active</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="categoryTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <div class="modal" id="categoryModal" aria-hidden="true">
            <div class="modal-backdrop" data-close-modal></div>

            <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <div class="modal-head">
                    <div>
                        <h3 id="modalTitle">Add Category</h3>
                        <p id="modalSubtitle">Create a new category for the list.</p>
                    </div>
                    <button type="button" class="icon-btn" data-close-modal aria-label="Close modal">×</button>
                </div>

                <form class="modal-form" id="categoryForm">
                    <input type="hidden" id="categoryId">

                    <div class="field">
                        <label for="categoryName">Category Name</label>
                        <input type="text" id="categoryName" name="name" placeholder="e.g. Mobile" autocomplete="off" required>
                    </div>

                    <div class="field">
                        <label for="categoryDescription">Description</label>
                        <textarea
                            id="categoryDescription"
                            name="description"
                            placeholder="Short description for this category"
                        ></textarea>
                    </div>

                    <div class="inline-row">
                        <div class="switch-copy">
                            <strong>Active status</strong>
                            <span>Turn off if you want to keep it in the list but inactive.</span>
                        </div>

                        <label class="switch" aria-label="Toggle active state">
                            <input type="checkbox" id="categoryActive" checked>
                            <span class="switch-slider"></span>
                        </label>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
                        <button type="submit" class="btn btn-primary" id="saveBtn">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>
