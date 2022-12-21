

async function GPT3request(searchParams = null){
    console.log('GPT3request called');
    let URLplusQuery;
    if (searchParams){
        URLplusQuery = '/botGPT3' + searchParams;
        console.log('GPT3request called w params:', searchParams);
    } else {
        URLplusQuery = '/botGPT3';
        console.log('GPT3request called w NO params');
    }
    const response = await fetch(URLplusQuery);
    if (!response.ok){ console.log('Fetch error: ', response.status);}
    let GPT3response = await response.json();
    console.log('response', GPT3response);
    return GPT3response;
}