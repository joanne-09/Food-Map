# Restaurant Finder

## Overview
Restaurant Finder is a web application that allows users to search for restaurants using the Google Maps API. The application provides an interactive map interface where users can view restaurant locations and details.

## Project Structure
```
restaurant-finder
├── src
│   ├── index.html       # Main HTML document
│   ├── styles.css       # Styles for the website
│   └── app.js           # JavaScript code for Google Maps API interaction
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/restaurant-finder.git
   cd restaurant-finder
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Obtain a Google Maps API key:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project and enable the Google Maps JavaScript API.
   - Generate an API key and add it to your `app.js` file.

4. **Run the application:**
   - Open `src/index.html` in your web browser to view the application.

## Usage
- Use the search functionality to find restaurants in your area.
- The map will display markers for each restaurant found, along with relevant information.

## Contributing
Feel free to submit issues or pull requests to improve the application. 

## License
This project is licensed under the MIT License.