Breakdown of the Magic 🪄
1. App Locale from Storage
Inside the Request Interceptor, we use Promise.all() to fetch both the accessToken and the appLocale from AsyncStorage at the same exact time (making it 2x faster than awaiting them one by one). It reads the locale and attaches it to the Accept-Language header. Django's locale middleware will automatically read this header and translate the response.

2. Request Deduplication (The Double-Click Saver)
If a user taps the "Submit Order" button 5 times rapidly, generateRequestKey creates a unique string combining the URL, HTTP method, and the JSON body payload.

The first tap sends the actual network request and saves the Promise in pendingRequests.

Taps 2, 3, 4, and 5 check the pendingRequests Map, see that the request is already flying through the air, and simply attach themselves to the first Promise instead of firing new requests.

You save server load and prevent accidental duplicate database entries!

3. Automatic "Exponential Backoff" Retries
If the user's phone temporarily loses cellular signal (Network Error) or your server gets overwhelmed (500 Error), the interceptor catches it.

It pauses for 1 second, then tries again.

If it fails again, it pauses for 2 seconds.

If it fails a 3rd time (pausing for 3 seconds), it finally throws the error to your UI. This creates a deeply resilient mobile experience.

4. Global Error & Success Handlers
All HTTP status codes are caught in a switch statement.

401 instantly clears the storage (forcing a logout).

Successes are logged cleanly (you can easily add a library like react-native-toast-message inside the if (response.config.method !== 'get') block to automatically show a green "Success" popup whenever a POST/PUT finishes!).