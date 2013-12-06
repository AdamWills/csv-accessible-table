function doConvert() {
	var input = $('#csvText').val();
	var hasRowHeaders = $('#optFirstRowHeaders').prop('checked');
	var hasColHeaders = $('#optFirstColHeaders').prop('checked');
	var hasFooter = $('#optLastRowFooter').prop('checked');
	var hasCaption = $('#optCaption').prop('checked');
	var captionText = $('#textCaption').val();
	var tablePreview = $("#table-preview");

	// trim some of that whitespace!!
	// borrowed from http://stackoverflow.com/questions/3721999/trim-leading-trailing-whitespace-from-textarea-using-jquery
	input = $.trim(input).replace(/\s*[\r\n]+\s*/g, '\n')
                               .replace(/(<[^\/][^>]*>)\s*/g, '$1')
                               .replace(/\s*(<\/[^>]+>)/g, '$1');


	// use the jquery-csv plugin to turn the csv into an array
	csvArray = $.csv.toArrays(input);
	
	// start creating the table
	var output = "<table>\n";
	
	// if the user wants a caption, add that!
	if (hasCaption) {
		output += "<caption>" + captionText + "</caption>\n";
	}

	// let's get the header if needed.
	if (hasRowHeaders) {
		var head = "";
		var firstRow = csvArray[0];

		head += "  <thead>\n    <tr>\n";

			$.each(firstRow,function(i,val){
				head += "      <th scope=\"col\">"+val+"</th>\n";
			});

		head += "    </tr>\n  </thead>\n";

		output += head;

		// remove the first row from the array
		csvArray.splice(0,1);
	}

	// let's get the footer if needed.
	// since the tfooter is placed before the body, we'll do the parsing acoordingly,
	// then remove the last row from the array so that it doesn't end up in the body again.
	if (hasFooter) {
		var footer = "";
		
		var lastElement = csvArray.length-1;
		var lastRow = csvArray[lastElement];
		
		footer += "  <tfoot>\n    <tr>\n";

			$.each(lastRow,function(i,val){
				footer += "      <th>"+val+"</th>\n";
			});

		footer += "    </tr>\n  </tfoot>\n";

		output += footer;

		// remove the last row from the array
		csvArray.splice(lastElement,1);
	}

	// now let's get to the body!
	var body = "  <tbody>\n";
	$.each(csvArray, function(i, val){
		
		// initialize the row output
		var row = "    <tr>\n";
		
		$.each(val,function(i,val){
			if (i===0 && hasColHeaders) {
				row += "      <th scope=\"row\">"+val+"</th>\n";
			}
			else {
				row += "      <td>"+val+"</td>\n";
			}
		});
		row += "    </tr>\n";

		
		body+=row;
	});


	body += "  </tbody>\n";

	output += body;
	
	output += "</table>";

	// output!
	$('#htmlText').val(output); // throw the html into a textarea
	tablePreview.html(output); // let's give the user a preview!
	tablePreview.find("table").addClass('table'); // adding twitter bootstrap style to make it purdy.
	$('.output').removeClass('hidden'); // show it!
}

// let's work on some interactive features

// only see the caption text field when it's necessary.
$('#optCaption').change(function() {
	$('.caption').toggleClass('hidden');
});