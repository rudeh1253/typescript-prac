import axios from "../node_modules/axios/index";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyBltKRdBHLhE6YKKRAKFwYHZneDpvjLD-4";

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

let map: google.maps.Map;
const center: google.maps.LatLngLiteral = {lat: 30, lng: -110};

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center,
    zoom: 8
  });
}

initMap();

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // Send this to Google's API
    // Axios contains .d.ts file.
    axios
        .get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
                enteredAddress
            )}&key=${GOOGLE_API_KEY}`
        )
        .then((response) => {
            if (response.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            const coordinate = response.data.results[0].geometry.location;
        })
        .catch((err) => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);
