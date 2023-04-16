async function getTrackData() {
    const settings = { action: 'get-track-data', jiggly: 'ass'};
    const url = '../php/simulationQueryManager.php';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    };


    const response = await fetch(url, options);
    console.log(response.ok);
    if (response.status != 200 || !response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.text();
    console.log(data);

}





// getTrackData();