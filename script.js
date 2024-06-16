import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      numImagesPerLoad: 12, // Number of images to load per request
      imageUrls: [], // Array to store image URLs
      loading: false, // Flag to indicate loading state
      errorMessage: null // Error message to be displayed (initially null)
    };
  },
  methods: {
    async loadCatImages(count) {
      this.loading = true; // Set loading state to true
      this.errorMessage = null; // Clear previous error message

      const promises = []; // Array to store promises for fetching images

      // Create promises for fetching cat images
      for (let i = 0; i < count; i++) {
        promises.push(
          fetch('https://cataas.com/cat')
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.blob();
            })
            .then(blob => URL.createObjectURL(blob))
            .catch(error => {
              console.error(error);
              return null; // Return null for failed requests
            })
        );
      }

      try {
        const results = await Promise.all(promises); // Wait for all promises to resolve
        const validResults = results.filter(result => result !== null); // Filter out failed requests
        this.imageUrls.push(...validResults); // Add valid image URLs to the array

        if (validResults.length < count) {
          this.errorMessage = 'Failed to load some images. Please try again.'; // Display error message if some images failed to load
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while loading images. Please try again.'; // Display error message if an error occurred
        console.error(error);
      } finally {
        this.loading = false; // Set loading state to false
      }
    },
    loadMoreCatImages() {
      this.loadCatImages(this.numImagesPerLoad); // Load more cat images based on the numImagesPerLoad value
    }
  },
  mounted() {
    this.loadCatImages(this.numImagesPerLoad); // Load initial cat images when the app is mounted
  }
});

app.mount('#app'); // Mount the Vue app