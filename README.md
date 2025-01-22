# Food Map

Food Map is a web application that allows users to search for restaurants within a specified area using Google Maps. The application provides a search box for finding places and displays markers for nearby restaurants on the map. Users can also click on the map to place a marker and view information about the selected place.

## Features

- Search for places using the search box
- Display markers for nearby restaurants within the visible map area
- Click on the map to place a marker and view information about the selected place
- Custom marker icons for restaurant markers
- Responsive layout with a sidebar for search and place information

## Technologies Used

- React
- Google Maps JavaScript API
- @react-google-maps/api
- CSS for styling

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/joanne-09/food-map.git
    cd food-map
    ```
2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `api_key.js` file in the `src` directory and add your Google Maps API key:

    ```js
    export const API_KEY = 'YOUR_API_KEY';
    ```

4. Start the development server:

    ```sh
    npm start
    ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.