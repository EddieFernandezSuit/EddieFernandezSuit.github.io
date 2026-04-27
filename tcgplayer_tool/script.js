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
        
        const returnAddressX = 20;
        const returnAddressY = 45;
        const AddressYDist = 15;
        const recipientAddressX = 200;
        const recipientAddressY = 160;

        page.drawText(`${returnAddress.returnName}`, { x: returnAddressX, y: pageHeight - returnAddressY, size: fontSize });
        page.drawText(`${returnAddress.returnStreet}`, { x: returnAddressX, y: pageHeight - (returnAddressY + AddressYDist), size: fontSize });
        page.drawText(`${returnAddress.returnCity}, ${returnAddress.returnStateZip}`, { x: returnAddressX, y: pageHeight - (returnAddressY + AddressYDist * 2), size: fontSize });
    
        
        page.drawText(`${FirstName} ${LastName}`, { x: recipientAddressX, y: pageHeight - recipientAddressY, size: fontSize });
        page.drawText(`${Address1}`, { x: recipientAddressX, y: pageHeight - (recipientAddressY + AddressYDist), size: fontSize });
        if (Address2) {
            page.drawText(`${Address2}`, { x: recipientAddressX, y: pageHeight - (recipientAddressY + AddressYDist * 2), size: fontSize });
            page.drawText(`${City}, ${State} ${PostalCode}`, { x: recipientAddressX, y: pageHeight - (recipientAddressY + AddressYDist * 3), size: fontSize });
        }else{
            page.drawText(`${City}, ${State} ${PostalCode}`, { x: recipientAddressX, y: pageHeight - (recipientAddressY + AddressYDist * 2), size: fontSize });
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
  