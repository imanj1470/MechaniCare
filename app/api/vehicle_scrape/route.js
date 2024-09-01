export async function POST(req) {
  try {
    const body = await req.json();
    const { vin } = body;

    //add scraping logic here and return to the add_car_modal in response. json of data:"brand":"volvo", "make":"xc90", etc
    const responseMessage = `Received VIN: ${vin}`;

    return new Response(JSON.stringify({ success: true, message: responseMessage }), {
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