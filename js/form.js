document.addEventListener("DOMContentLoaded", () => {

    // Form validation
    if (document.querySelector('.contact_page_form_section')) {

        // Define the error SVG
        const errorSVG = `<svg class="warning-sign" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99963 6.49995V9.83328M9.99963 13.1666H10.008M8.84573 2.24305L1.99166 14.0819C1.61149 14.7386 1.4214 15.0669 1.4495 15.3364C1.474 15.5714 1.59714 15.785 1.78828 15.924C2.00741 16.0833 2.38679 16.0833 3.14556 16.0833H16.8537C17.6125 16.0833 17.9919 16.0833 18.211 15.924C18.4021 15.785 18.5253 15.5714 18.5498 15.3364C18.5779 15.0669 18.3878 14.7386 18.0076 14.0819L11.1535 2.24305C10.7747 1.58875 10.5853 1.26159 10.3382 1.15172C10.1227 1.05587 9.8766 1.05587 9.66105 1.15172C9.41394 1.26159 9.22454 1.58875 8.84573 2.24305Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        // let errorSVG = `<span class="warning-sign">&#9888;</span>`;

        function addSVGToErrors() {
            // Find all error labels that don't already have an SVG
            $('label.error:visible').each(function () {
                const $label = $(this);
                if (!$label.find('.warning-sign').length) {
                    const currentHTML = $label.html();
                    $label.html(errorSVG + currentHTML);
                }
            });
        }

        $("form").each(function (e) {
            $.validator.addMethod("letters", function (value, element) {
                return this.optional(element) || value == value.match(/^[a-zA-Z\s]*$/);
            });
            $.validator.addMethod("customEmail", function (value, element) {
                return (
                    this.optional(element) || /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)
                );
            });
            $(this).validate({
                rules: {
                    yourname: {
                        required: true,
                        letters: true
                    },
                    youremail: {
                        required: true,
                        email: true,
                        customEmail: true
                    },
                    checkbox: {
                        required: true
                    }
                },
                messages: {
                    youremail:
                        "Please specify a valid email address <span class='email-example'>(e.g.: user@example.com)</span>"
                },
                errorPlacement: function (error, element) {
                    // // Check if this is a checkbox
                    // if (element.hasClass('w-checkbox-input')) {
                    //     // For checkboxes, insert the error after the span with the checkbox text
                    //     const checkboxLabel = element.closest('.w-checkbox');
                    //     const textSpan = checkboxLabel.find('.w-form-label');
                    //     if (textSpan.length) {
                    //         error.insertAfter(textSpan);
                    //     } else {
                    //         // Fallback: insert at the end of the checkbox container
                    //         error.appendTo(checkboxLabel);
                    //     }
                    // } else {
                    //     // For all other inputs, place error after the element as usual
                    //     error.insertAfter(element);
                    // }

                    // setTimeout(() => {
                    //     error[0].classList.add("show");
                    //     addSVGToErrors(); // Add SVG after the error is placed
                    // }, 200);

                    // Prevent jQuery Validate from adding error elements to the DOM
                    console.log("errorPlacement called for:", element.attr('name'));
                    return false;

                },
                highlight: function (element) {
                    const $element = $(element);
                    let $errorDiv;

                    // For checkboxes, go up to the label then find sibling error div
                    if ($element.hasClass('w-checkbox-input')) {
                        $errorDiv = $element.closest('label').siblings('.error');
                    } else {
                        // For regular inputs, check siblings first
                        $errorDiv = $element.siblings('.error');

                        // If not found, look in parent
                        if ($errorDiv.length === 0) {
                            $errorDiv = $element.parent().find('.error');
                        }
                    }

                    console.log(`Field: ${element.name}, found: ${$errorDiv.length}`);
                    $errorDiv.addClass('show');
                },
                unhighlight: function (element) {
                    const $element = $(element);
                    let $errorDiv;

                    if ($element.hasClass('w-checkbox-input')) {
                        $errorDiv = $element.closest('label').siblings('.error');
                    } else {
                        $errorDiv = $element.siblings('.error');

                        if ($errorDiv.length === 0) {
                            $errorDiv = $element.parent().find('.error');
                        }
                    }

                    $errorDiv.removeClass('show');
                }
                // showErrors: function (errorMap, errorList) {
                //     // Call the default showErrors method
                //     this.defaultShowErrors();
                //     // Add SVGs to any visible errors
                //     setTimeout(() => {
                //         addSVGToErrors();
                //     }, 50);
                // }
            });
        });
    }

    // Radio Button
    document.querySelectorAll('.w-checkbox-input.checkbox').forEach((input) => {
        input.addEventListener('change', () => {
            // Toggle active class
            input.classList.toggle('active');
        });
    });

});