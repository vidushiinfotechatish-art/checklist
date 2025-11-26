$(document).ready(function () {
    $('.clear-all').on('click', function () {

        if (confirm("Delete all records Are you sure?")) {
            $('input[type="checkbox"]').prop('checked', false);
            $('label').each(function () {
                this.style.textDecoration = "unset";
                this.style.color = "#1e2939";
            });
            $('li').each(function () {
                localStorage.setItem($(this).find('> .flex input[type="checkbox"]').attr('id'), false);
                $(this).find('ul input[type="checkbox"]').each(function () {
                    localStorage.setItem($(this).attr('id'), false);
                });
            });
           window.location.reload();
        }

    });
    let prograssBar = $('#progracess-bar');

    // STEP 1: Assign unique IDs if missing
    $('input[type="checkbox"]').each(function (index) {
        if (!$(this).attr('id')) {
            $(this).attr('id', 'cb_' + index);
        }
    });

    // STEP 2: Restore saved checkbox states
    $('input[type="checkbox"]').each(function () {
        let id = $(this).attr('id');
        let saved = localStorage.getItem(id);

        if (saved === "true") {
            $(this).prop('checked', true);
            let label = $(this).next('label')[0];
            if (label) {
                label.style.textDecoration = "line-through";
                label.style.color = "#798ba4ff";
            }
        }
    });

    // After restoring states, sync parents & progress
    $('li').each(function () {
        updateParent($(this));
        updateChildren($(this));
    });

    initializeProgress();



    // Clicking label toggles checkbox
    $('label').on('click', function () {
        let checkbox = $(this).prev();
        let id = checkbox.attr('id');

        if (checkbox.prop('checked')) {
            checkbox.prop('checked', false);
            this.style.textDecoration = "unset";
            this.style.color = "#1e2939";
            localStorage.setItem(id, false);
        } else {
            checkbox.prop('checked', true);
            this.style.textDecoration = "line-through";
            this.style.color = "#798ba4ff";
            localStorage.setItem(id, true);
        }

        updateParent($(this).closest('li'));
        updateChildren($(this).closest('li'));

        saveChildrenState($(this).closest('li'));
        initializeProgress();
    });



    // When checkbox directly changes
    $('input[type="checkbox"]').on('change', function () {
        let li = $(this).closest('li');
        let id = $(this).attr('id');
        localStorage.setItem(id, $(this).prop('checked'));

        updateParent(li);
        updateChildren(li);

        saveChildrenState(li);
        initializeProgress();
    });



    // Save children when parent toggles
    function saveChildrenState(li) {
        li.find('ul input[type="checkbox"]').each(function () {
            let id = $(this).attr('id');
            localStorage.setItem(id, $(this).prop('checked'));
        });
    }



    // Parent update logic
    function updateParent(li) {
        var parentLi = li.parent().closest('li');
        if (parentLi.length === 0) return;

        var parentCheckbox = parentLi.find('> .flex input[type="checkbox"]');
        var allChildren = parentLi.find('> ul input[type="checkbox"]');
        var checkedChildren = parentLi.find('> ul input[type="checkbox"]:checked');

        if (allChildren.length > 0) {
            parentCheckbox.prop('checked', allChildren.length === checkedChildren.length);
            localStorage.setItem(parentCheckbox.attr('id'), parentCheckbox.prop('checked'));
        }
    }



    // Children update logic
    function updateChildren(li) {
        var parentCB = li.find('> .flex input[type="checkbox"]');

        if (parentCB.length === 0) return;

        var children = li.find('> ul input[type="checkbox"]');

        if (children.length > 0 && parentCB.prop('checked')) {
            children.prop('checked', true).each(function () {
                var lbl = $(this).next('label')[0];
                lbl.style.textDecoration = "line-through";
                lbl.style.color = "#798ba4ff";

                localStorage.setItem($(this).attr('id'), true);
            });
        } else if (children.length > 0 && !parentCB.prop('checked')) {
            children.prop('checked', false).each(function () {
                var lbl = $(this).next('label')[0];
                lbl.style.textDecoration = "unset";
                lbl.style.color = "#1e2939";

                localStorage.setItem($(this).attr('id'), false);
            });
        }
    }



    // Progress bar logic
    function initializeProgress() {
        let pare = $('.parent-checkbox');
        let totalParent = pare.length;
        let checkedParent = $('.parent-checkbox:checked').length;
        let progressPercent = Math.round((checkedParent / totalParent) * 100);

        $('.compound-text').text('(' + checkedParent + '/' + totalParent + ')');
        $('.progracess-text').text(progressPercent + '% ');
        prograssBar.css('width', progressPercent + '%');

        localStorage.setItem('progressValue', progressPercent);
    }

});
