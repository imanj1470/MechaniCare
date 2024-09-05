const scrape = async (vin) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`, {
      method: 'GET',
    });

    if (!response.ok ) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const result = await response.json() 
    const result_list = result['Results'] //this is a list of objects but json is formatted weird
    console.log("JSON BEFORE FORMATTING", result_list) //can see it here


    let new_model_object = {}
    for (const index in result_list){ //looping through the list given by the get request
      const variable = String(result_list[index].Variable) //fixing the object by putting the Variable as the key and Value as the Value in the new object
      const value = result_list[index].Value
      new_model_object[variable] = value
    }

    console.log("JSON OBJECT FORMATTED: \n", new_model_object)

    const recalls = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${new_model_object.Make}&model=${new_model_object.Model}&modelYear=${new_model_object["Model Year"]}`, {
      method: 'GET', // this calls the recall API with make, model, and year as params
    });

    const recall_response = await recalls.json()

    console.log("RECALLS FOR MODEL: \n", recall_response)

    new_model_object["Recalls"] = recall_response["results"] //updating object to include the list of json recalls

    console.log("JSON WITH VIN INFORMATION AND RECALLS: \n", new_model_object)

    return new_model_object

  } catch (error) {
    console.error('Error during get Request:', error);
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
