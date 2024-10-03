fetchInfo();
        
        async function fetchInfo(){

            const response = await fetch('/api');
            const FetchedInfo = await response.json();
            


            for (item of FetchedInfo){
            const container = document.createElement('p');
            const geolocation = document.createElement('div');
            const date = document.createElement('div');
            const dateString = new Date(item.timestamp).toLocaleString();
            

            
            geolocation.textContent = `Location: ${item.lat}, ${item.long}`;
            date.textContent = dateString;
            console.log(item.lat, item.long, dateString);
            container.append(geolocation, date);
            document.body.append(container);
            
        }
        
        

    }