import streamlit as st

st.set_page_config(page_title="Restaurant Finder", layout="wide")

st.title("Restaurant Finder")

# HTML and JavaScript for Google Maps
html_code = """
<!DOCTYPE html>
<html>
<head>
    <title>Restaurant Finder</title>
    <style>
        #map {
            height: 500px;
            width: 100%;
        }
    </style>
</head>
<body>
    <input type="text" id="search-input" placeholder="Search for restaurants">
    <button id="search-button">Search</button>
    <div id="map"></div>

    <script src="src/apikey.js" type="module"></script>
    <script src="src/app.js" type="module"></script>
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap">
    </script>
</body>
</html>
"""

st.components.v1.html(html_code, height=600)