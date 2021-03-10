var rb = require('./index');

const registerBlastApiClient = new rb({
    url: 'https://www.registerblast.com/spv2',
    apiKey: '',
    username: 'jason@smarterservices.com',
    password: ''
  });


var data = {
    "startDate":"2021-02-24T05:00:00.000",
    "endDate":"2021-02-25T04:59:59.000Z",
    "examGroups":[258312],
    "duration": 60
}

registerBlastApiClient.getAvailability(data)
.then(response => {
    console.log(response);
  });

