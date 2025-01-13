document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Get return address values
    const returnName = document.getElementById('returnName').value.trim();
    const returnStreet = document.getElementById('returnStreet').value.trim();
    const returnCity = document.getElementById('returnCity').value.trim();
    const returnStateZip = document.getElementById('returnStateZip').value.trim();
    const returnAddress = { returnName, returnStreet, returnCity, returnStateZip };
  
    // Get CSV file
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    if (!file) {
      alert('Please upload a CSV file.');
      return;
    }
  
    // Parse CSV
    const csvData = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  
    // Generate PDF
    const pdfDoc = await PDFLib.PDFDocument.create();
    const pageWidth = 6.5 * 72; // #6 envelope width (6.5 inches)
    const pageHeight = 3.625 * 72; // #6 envelope height (3.625 inches)
    const fontSize = 12;
  
    csvData.forEach((row) => {
      if(row['Order #']){
        console.log(row)
        const { FirstName, LastName, Address1, Address2, City, State, PostalCode } = row;
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
        // Add return address
        page.drawText(`${returnAddress.returnName}`, { x: 20, y: pageHeight - 30, size: fontSize });
        page.drawText(`${returnAddress.returnStreet}`, { x: 20, y: pageHeight - 45, size: fontSize });
        page.drawText(`${returnAddress.returnCity}, ${returnAddress.returnStateZip}`, { x: 20, y: pageHeight - 60, size: fontSize });
    
        // Add recipient address
        page.drawText(`${FirstName} ${LastName}`, { x: 200, y: pageHeight - 100, size: fontSize });
        page.drawText(`${Address1}`, { x: 200, y: pageHeight - 115, size: fontSize });
        if (Address2) {
            page.drawText(`${Address2}`, { x: 200, y: pageHeight - 130, size: fontSize });
            page.drawText(`${City}, ${State} ${PostalCode}`, { x: 200, y: pageHeight - 145, size: fontSize });
        }else{
            page.drawText(`${City}, ${State} ${PostalCode}`, { x: 200, y: pageHeight - 130, size: fontSize });
        }
      }
    });
  
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'envelopes.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
  