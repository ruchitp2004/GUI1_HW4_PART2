/*   Name: Ruchit Patel
     Date: 11/24/2025
     File: table.js
     HW4 – Using the jQuery Plugin/UI with Your Dynamic Table
           Part 1: Validation Plugin

     Description:
     (Part 1) Uses the jQuery Validation plugin to validate user input.
     If valid, dynamically generates a multiplication table.
     The validation plugin make sure that the user input are 
     numbers, in range of -50 and 50, and that the minimum value 
     is less that maximum value. Also displays error messages 
     below input fields.

     (Part 2) Adds jQuery UI features like Sliders for input fields. Each
     input field is now linked to its own sliderusing two-way binding. The 
     script updates the slider dynamically when the user changes the value. 
     If the user click generate table button, then the table is saved in tabs. 
     The lable of each tab wii be the four input value. So, the user can see 
     and go to the right table. And then also delete the individula tab or select
     multiple tabs and delete them at once.

     In part one when user inputs wrong values the error mesage was in the starting value. 
     So, lets say if the user inputs starting value as 10 and then Ending value as 0. The 
     it will give error message in that "Starting value must be less than or equal value".
     I changes this in part 2 nor the user will get error message in the Ending value input box.
     Bot works perfectly fine but just a small change in user experience.
     
     Citation: 
     https://jqueryvalidation.org/validate/
     https://jqueryvalidation.org/jQuery.validator.addMethod/

*/

$(document).ready(function () {

    $("#tabs").tabs();
    let tabIndex = 1;

    // Custom rule to check that min value must be <= max value
    $.validator.addMethod("lessthanorequal", function (value, element, param) {
        let target = $(param).val();
        if (target === "") return true;
        return parseInt(value) >= parseInt(target);
    }, "Value must be greater than or equal to the minimum.");

    // Apply jQuery Validation to the form
    $("#inputform").validate({

        rules: {
            startY: {
                required: true,
                number: true,
                min: -50,
                max: 50            },
            endY: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessthanorequal: "#startY"
            },
            startX: {
                required: true,
                number: true,
                min: -50,
                max: 50            },
            endX: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessthanorequal: "#startX"
            }
        },

        messages: {
            startY: {
                required: "Enter a starting Y value.",
                min: "Minimum Y value cannot be less than -50.",
                max: "Maximum Y value cannot be greater than 50."
            },
            endY: {
                required: "Enter an ending Y value.",
                min: "Minimum Y value cannot be less than -50.",
                max: "Maximum Y value cannot be greater than 50.",
                lessthanorequal: "Maximum value Y must be greater than or equal to Minimum value Y."
            },
            startX: {
                required: "Enter a starting X value.",
                min: "Minimum X value cannot be less than -50.",
                max: "Maximum X value cannot be greater than 50."
            },
            endX: {
                required: "Enter an ending X value.",
                min: "Minimum X value cannot be less than -50.",
                max: "Maximum X value cannot be greater than 50.",
                lessthanorequal: "Maximum value X must be greater than or equal to Minimum value X."
            }
        },

        // Shoes error messages after the input element
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },

        // Make sure that the form is submitted to generate the table only if valid
        submitHandler: function () {
            generateTable();
        }
    });

    function sliders() {
        const inputs = ["startX", "endX", "startY", "endY"];
        inputs.forEach(id => {
            const $input = $("#" + id);
            const $slider = $("#" + id + "_slider");

            $slider.slider({
                min: -50,
                max: 50,
                value: parseInt($input.val()) || 0,
                slide: function (event, ui) {
                    $input.val(ui.value);
                    $input.valid();
                    generateTable();
                }
            });

            $input.on("input", function () {
                const val = parseInt($input.val());
                if (!isNaN(val)) {
                    $slider.slider("value", val);
                    $input.valid();
                    generateTable();
                }
            });
        });
    }

    sliders();

    // Generate multiplication table
    function generateTable() {

        const startY = parseInt($("#startY").val());
        const endY = parseInt($("#endY").val());
        const startX = parseInt($("#startX").val());
        const endX = parseInt($("#endX").val());

        const tableContainer = $("#tableContainer");
        tableContainer.html(""); // clear old table

        const table = $("<table></table>");

        // Header row
        const headerRow = $("<tr></tr>");
        headerRow.append($("<th></th>")); // empty corner cell

        for (let x = startX; x <= endX; x++) {
            headerRow.append($("<th></th>").text(x));
        }
        table.append(headerRow);

        // Data rows
        for (let y = startY; y <= endY; y++) {
            const row = $("<tr></tr>");

            row.append($("<th></th>").text(y));

            for (let x = startX; x <= endX; x++) {
                row.append($("<td></td>").text(x * y));
            }

            table.append(row);
        }

        tableContainer.append(table);
    }

    // Generate table in new tab //
        // --- Generate Table in New Tab ---
    $("#createTab").on("click", function (e) {
        e.preventDefault();
        if (!$("#inputform").valid()) return; // Only create tab if form valid

        const startX = parseInt($("#startX").val());
        const endX = parseInt($("#endX").val());
        const startY = parseInt($("#startY").val());
        const endY = parseInt($("#endY").val());

        const table = $("<table></table>");
        const headerRow = $("<tr></tr>").append($("<th></th>"));
        for (let x = startX; x <= endX; x++) headerRow.append($("<th></th>").text(x));
        table.append(headerRow);
        for (let y = startY; y <= endY; y++) {
            const row = $("<tr></tr>").append($("<th></th>").text(y));
            for (let x = startX; x <= endX; x++) row.append($("<td></td>").text(x * y));
            table.append(row);
        }

        const tabId = "tab-" + tabIndex++;
        $("#tabs ul").append(
            `<li>
            <input type="checkbox" class="tab-select" data-tab="#${tabId}"> 
            <a href="#${tabId}">X:(${startX},${endX}), Y:(${startY},${endY})</a>
             <span class='close-tab' style='cursor:pointer;'> x</span></li>`
        );
        $("#tabs").append(`<div id="${tabId}"></div>`);
        $("#" + tabId).append(table);

        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", $("#tabs ul li").length - 1);

        // Close tab button
        $(".close-tab").off("click").on("click", function () {
            const panelId = $(this).siblings("a").attr("href");
            $(this).parent().remove();
            $(panelId).remove();
            $("#tabs").tabs("refresh");
        });
    });

    $("#deleteSelected").on("click", function () {
        $(".tab-select:checked").each(function() {
        const panelId = $(this).data("tab"); // the associated tab content div
        const $li = $(this).closest("li");    // ensure we target the li properly

        $li.remove();       // remove the tab <li>
        $(panelId).remove(); // remove the tab content <div>
    });

    $("#tabs").tabs("refresh");
    });
});


