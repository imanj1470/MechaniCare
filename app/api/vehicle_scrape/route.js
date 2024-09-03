const scrape = async (vin) => {
  try {
      const response = await fetch(`https://vincheck.info/check/vehicle-specification.php?vin=${vin}`, {
          method: 'GET',
      });

      if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
      }

      const result = await response.text(); 
      console.log('Server response:', result);
      const cheerio = require('cheerio');

      const $ = cheerio.load(result);
      const vehicleSpecDiv = $('.vehicle-spec-tbl');

      // Check if the div is found
      if (vehicleSpecDiv.length > 0) {
        // Extract the table rows
        const rows = vehicleSpecDiv.find('table tbody tr');
      
        rows.each((index, row) => {
          const cells = $(row).find('td');
          const rowData = {};
      
          cells.each((cellIndex, cell) => {
            const text = $(cell).text().trim();
            if (cellIndex % 2 === 0) {
              rowData[$(cell).text().trim()] = '';
            } else {
              rowData[Object.keys(rowData).pop()] = text;
            }
          });
      
          console.log(rowData);
        });
      } else {
        console.error('No div with the class vehicle-spec-tbl found.');
      }
      return result; 
  } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
  }
};

export async function POST(req) {
  try {
      const body = await req.json();
      const { vin } = body;

      const scrapedData = await scrape(vin); // Use the scrape function to get the data

      return new Response(JSON.stringify({ success: true, message: scrapedData }), {
          status: 200,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  }
}
