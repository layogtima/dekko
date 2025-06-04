// script.js (Incorporating user's uploaded version and new requests)

const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

// --- WelcomeScreen Component ---
const WelcomeScreen = {
    props: ['navigateTo'],
    template: `
        <div class="flex-grow flex flex-col items-center justify-center p-8 h-full text-center">
            <h1 class="text-6xl md:text-7xl font-bold mb-4 leading-none">
                DEKK<span class="text-xs align-super tracking-normal">O</span>
            </h1>
            <p class="text-lg md:text-xl max-w-xs mb-12">
                Art is everywhere. Let's decode it.
            </p>
            <button @click="startOnboarding"
                    class="bg-black text-white px-10 py-4 text-sm uppercase tracking-widest font-bold rounded-md hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Begin
            </button>
        </div>
    `,
    methods: {
        startOnboarding() {
            this.navigateTo('OnboardingScreenB1');
        }
    }
};

// --- OnboardingScreenB1 Component (Taste-Finder Questions) ---
const OnboardingScreenB1 = {
    props: ['navigateTo'],
    setup(props) {
        const currentQuestionIndex = ref(0);
        // Using image paths from user's script.js
        const questions = ref([
            {
                id: 1,
                prompt: "Which vibe speaks to you more?",
                imageA: { src: "images/geometric.jpeg", alt: "Bold geometric art" },
                imageB: { src: "images/soft-abstract.jpg", alt: "Soft abstract art" }
            },
            {
                id: 2,
                prompt: "Your eyes are drawn to...",
                imageA: { src: "images/vibrant.jpeg", alt: "Vibrant color art" },
                imageB: { src: "images/monochrome.jpg", alt: "Monochrome art" }
            },
            {
                id: 3,
                prompt: "This feels more like 'you':",
                imageA: { src: "images/playful.jpeg", alt: "Playful pattern art" },
                imageB: { src: "images/abstract.jpg", alt: "Minimalist form art" } // User had abstract.jpg, assuming it means minimalist form
            },
            {
                id: 4,
                prompt: "Pick a texture:",
                imageA: { src: "https://placehold.co/300x400/D2B48C/000000?text=Rough%20%26%20Earthy", alt: "Rough earthy texture" },
                imageB: { src: "https://placehold.co/300x400/F0F8FF/000000?text=Smooth%20%26%20Sleek", alt: "Smooth sleek texture" }
            },
            {
                id: 5,
                prompt: "A scene that calls to you:",
                imageA: { src: "https://placehold.co/300x400/87CEEB/FFFFFF?text=Dreamy%20Landscape", alt: "Dreamy landscape" },
                imageB: { src: "https://placehold.co/300x400/4682B4/FFFFFF?text=Urban%20Structure", alt: "Urban structure" }
            }
        ]);
        const userSelections = ref([]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const totalQuestions = computed(() => questions.value.length);

        function selectImage(questionId, choiceKey, choiceAlt) {
            const existingSelection = userSelections.value.find(s => s.questionId === questionId);
            if (existingSelection) {
                existingSelection.choice = choiceKey;
                existingSelection.alt = choiceAlt;
            } else {
                userSelections.value.push({ questionId, choice: choiceKey, alt: choiceAlt });
            }
            proceed();
        }

        function proceed() {
            if (currentQuestionIndex.value < totalQuestions.value - 1) {
                currentQuestionIndex.value++;
            } else {
                console.log("Taste-finder selections:", JSON.parse(JSON.stringify(userSelections.value)));
                props.navigateTo('OnboardingScreenB2');
            }
        }

        return { currentQuestionIndex, currentQuestion, totalQuestions, selectImage };
    },
    template: `
        <div class="flex-grow flex flex-col items-center justify-between p-4 h-full text-center">
            <div class="w-full mb-4">
                <p class="text-xs text-gray-500">Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</p>
                <div class="bg-gray-200 rounded-full h-1 w-full mt-1">
                    <div class="bg-black h-1 rounded-full" :style="{ width: ((currentQuestionIndex + 1) / totalQuestions) * 100 + '%' }"></div>
                </div>
            </div>
            
            <div v-if="currentQuestion" class="flex-grow flex flex-col items-center justify-center w-full">
                <p class="text-lg font-semibold mb-6 px-2">{{ currentQuestion.prompt }}</p>
                <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
                    <div @click="selectImage(currentQuestion.id, 'A', currentQuestion.imageA.alt)" 
                         class="cursor-pointer border-2 border-transparent hover:border-black rounded-lg overflow-hidden transition-all duration-200 p-1 active:scale-95 focus:outline-none focus:border-black">
                        <img :src="currentQuestion.imageA.src" :alt="currentQuestion.imageA.alt" class="w-full h-auto object-cover rounded-md aspect-[3/4]">
                    </div>
                    <div @click="selectImage(currentQuestion.id, 'B', currentQuestion.imageB.alt)"
                         class="cursor-pointer border-2 border-transparent hover:border-black rounded-lg overflow-hidden transition-all duration-200 p-1 active:scale-95 focus:outline-none focus:border-black">
                        <img :src="currentQuestion.imageB.src" :alt="currentQuestion.imageB.alt" class="w-full h-auto object-cover rounded-md aspect-[3/4]">
                    </div>
                </div>
            </div>
            
            <div class="mt-auto pt-4">
                 <p class="text-2xl font-bold">DEKK<span class="text-xs align-super tracking-normal">O</span></p>
            </div>
        </div>
    `
};

// --- OnboardingScreenB2 Component ("Art is Everywhere" message) ---
const OnboardingScreenB2 = {
    props: ['navigateTo'],
    template: `
        <div class="flex-grow flex flex-col items-center justify-center p-8 h-full text-center">
            <span class="fa-stack fa-3x mb-8">
              <i class="far fa-circle fa-stack-2x text-black"></i>
              <i class="far fa-eye fa-stack-1x fa-inverse"></i>
            </span>
            <h2 class="text-3xl font-bold mb-4">Art is Everywhere!</h2>
            <p class="text-md max-w-xs mb-10">
                From street signs to ancient scripts, Dekko helps you see and understand the art all around you.
            </p>
            <button @click="navigateTo('OnboardingScreenB3')"
                    class="bg-black text-white px-10 py-4 text-sm uppercase tracking-widest font-bold rounded-md hover:bg-gray-800 transition-colors duration-300">
                Next: Create Your Art Persona
            </button>
        </div>
    `
};

// --- OnboardingScreenB3 Component (AI Self-Portrait) ---
const OnboardingScreenB3 = {
    props: ['navigateTo'],
    setup(props) {
        const uploadedImage = ref(null);
        const personaImage = ref('https://placehold.co/200x200/000000/FFFFFF?text=Your+Art+Persona'); 

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImage.value = e.target.result;
                    personaImage.value = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        }

        function finishOnboarding() {
            console.log("AI Self-Portrait 'generated'. Navigating to Main App Hub.");
            props.navigateTo('MainAppHub', { userPersonaImage: personaImage.value });
        }

        return { uploadedImage, personaImage, handleImageUpload, finishOnboarding };
    },
    template: `
        <div class="flex-grow flex flex-col items-center justify-center p-6 h-full text-center">
            <h2 class="text-3xl font-bold mb-4">Create Your Art Persona</h2>
            <p class="text-md max-w-xs mb-6">
                Upload a photo. We'll craft an AI self-portrait based on your unique taste. This will be your Dekko profile picture! (Mock-up uses uploaded image directly)
            </p>
            
            <label for="photoUpload" class="cursor-pointer">
                <img :src="personaImage" alt="Your art persona placeholder or uploaded image" class="w-40 h-40 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center mb-6 object-cover border-2 border-gray-300">
                <input type="file" id="photoUpload" @change="handleImageUpload" accept="image/*" class="hidden">
            </label>
            <p v-if="!uploadedImage" class="text-xs text-gray-500 -mt-4 mb-4">Tap image to upload</p>
            
            <button @click="finishOnboarding"
                    class="bg-black text-white px-10 py-4 text-sm uppercase tracking-widest font-bold rounded-md hover:bg-gray-800 transition-colors duration-300">
                Generate & Enter Dekko
            </button>
        </div>
    `
};

// --- MainAppHub Component (Screen C - Your Collection) ---
const MainAppHub = {
    props: ['navigateTo', 'appState'],
     setup(props) {
        const collectionItems = ref([
            { id: 1, title: "Koramangala Street Art", type: "Graffiti", imageUrl: "images/koramangala.jpeg", alt: "Graffiti art from Koramangala featuring two stylized female figures and text." },
            { id: 2, title: "Abstract Forms", type: "Digital", imageUrl: "https://placehold.co/300x300/3498DB/FFFFFF?text=Abstract+1", alt: "Placeholder for abstract art 1" },
            { id: 3, title: "Monochrome Study", type: "Photography", imageUrl: "https://placehold.co/300x300/000000/FFFFFF?text=Mono+Study", alt: "Placeholder for monochrome study" },
        ]);
         const userPersonaImage = computed(() => props.appState?.userPersonaImage || 'https://placehold.co/40x40/CCCCCC/000000?text=U');

        return { collectionItems, userPersonaImage };
    },
    template: `
        <div class="flex-grow flex flex-col h-full">
            <header class="p-4 flex justify-between items-center border-b border-gray-200">
                <h1 class="text-2xl font-bold">DEKK<span class="text-xs align-super tracking-normal">O</span></h1>
                <img :src="userPersonaImage" alt="User persona" class="w-8 h-8 rounded-full object-cover">
            </header>

            <div class="flex-grow p-4 overflow-y-auto pb-36">
                <h2 class="text-xl font-semibold mb-4">My Collection</h2>
                <div v-if="collectionItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div v-for="item in collectionItems" :key="item.id" 
                         @click="navigateTo('DecodeScreen', { artId: item.id, imageUrl: item.imageUrl, artTitle: item.title, alt: item.alt })"
                         class="cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                        <img :src="item.imageUrl" :alt="item.alt" class="w-full h-full object-cover">
                    </div>
                </div>
                <p v-else class="text-gray-500">Your collection is empty. Start decoding art!</p>
            </div>
            
            <nav class="bottom-tab-bar">
                <button @click="navigateTo('MainAppHub')" class="focus:outline-none">
                    <i class="far fa-album-collection"></i>
                </button>
                <button @click="navigateTo('CaptureScreen')" class="focus:outline-none camera-button-stack">
                     <i class="fa-regular fa-camera-polaroid"></i>
                </button>
                <button @click="navigateTo('PublicGalleryScreen')" class="focus:outline-none">
                    <i class="fa-brands fa-galactic-republic"></i>
                </button>
            </nav>
        </div>
    `
};

// --- CaptureScreen Component (Screen D - Camera UI) ---
const CaptureScreen = {
    props: ['navigateTo'],
    setup(props) {
        const videoElement = ref(null); // To store the actual video DOM element
        const canvasElement = ref(null); // To store the actual canvas DOM element
        const streamActive = ref(false);
        const cameraError = ref(null);
        const showMessageModal = ref(false); // Renamed for clarity
        const messageTextModal = ref(''); // Renamed for clarity

        async function startCamera() {
            // Ensure DOM elements are available
            videoElement.value = document.getElementById('cameraFeed');
            canvasElement.value = document.getElementById('photoCanvas');

            if (!videoElement.value) {
                console.error("Video element not found");
                cameraError.value = "Camera display element is missing.";
                messageTextModal.value = "Camera display error. Please try again.";
                showMessageModal.value = true;
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                videoElement.value.style.display = 'block'; // Make video element visible
                videoElement.value.srcObject = stream;
                await videoElement.value.play(); // Wait for play to start
                streamActive.value = true;
                cameraError.value = null;
                console.log("Camera started successfully");
            } catch (err) {
                console.error("Error accessing camera:", err);
                cameraError.value = "Could not access camera.";
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    messageTextModal.value = "Camera permission denied. Please enable it in your browser settings and refresh.";
                } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    messageTextModal.value = "No camera found. Make sure a camera is connected and enabled.";
                } else {
                    messageTextModal.value = `An error occurred: ${err.message}`;
                }
                showMessageModal.value = true;
                if (videoElement.value) videoElement.value.style.display = 'none'; // Hide if error
            }
        }

        function stopCamera() {
            if (videoElement.value && videoElement.value.srcObject) {
                videoElement.value.srcObject.getTracks().forEach(track => track.stop());
                videoElement.value.style.display = 'none'; // Hide video element
            }
            streamActive.value = false;
            console.log("Camera stopped");
        }

        function takePicture() {
            if (!streamActive.value || !videoElement.value || !canvasElement.value) {
                console.log("Camera not active or elements not ready for picture.");
                return;
            }
            const context = canvasElement.value.getContext('2d');
            canvasElement.value.width = videoElement.value.videoWidth;
            canvasElement.value.height = videoElement.value.videoHeight;
            context.drawImage(videoElement.value, 0, 0, canvasElement.value.width, canvasElement.value.height);
            const imageDataUrl = canvasElement.value.toDataURL('image/jpeg');
            console.log("Picture taken (simulated):", imageDataUrl.substring(0,30) + "...");
            
            // Stop camera AFTER taking picture and BEFORE navigating
            stopCamera(); 
            
            props.navigateTo('DecodeScreen', { 
                imageUrl: 'images/Koramangala.jpeg', // Using Koramangala for mock decode
                artTitle: "Captured Street Art",
                alt: "Newly captured street art, to be decoded.", // Generic alt for new captures
                isCapture: true 
            }); 
        }
        
        function closeMessageModal() {
            showMessageModal.value = false;
            // Only navigate back if it's a critical error preventing camera use
            if (cameraError.value && !streamActive.value) {
                 props.navigateTo('MainAppHub');
            }
        }

        onMounted(() => {
            // The navigateTo function in the root app now handles showing/hiding #cameraFeed
            // So, startCamera will be called when this component is shown.
            // We need to ensure this component signals the root app that it needs the camera.
            // For now, let's assume navigateTo handles the display of #cameraFeed correctly.
            // If the camera is supposed to start immediately, call it here.
            // However, the global navigateTo in root already handles cameraFeed display.
            // We just need to ensure it's called correctly.
            if (document.getElementById('cameraFeed').style.display === 'block') {
                 startCamera();
            }
        });

        onUnmounted(() => {
            stopCamera();
        });
        
        // Expose to template
        return { streamActive, cameraError, takePicture, navigateTo: props.navigateTo, showMessageModal, messageTextModal, closeMessageModal };
    },
    template: `
        <div class="flex-grow flex flex-col items-center justify-center h-full bg-black text-white relative">
            <!-- Camera feed is a global element in index.html, its display is managed by root app's navigateTo -->
            
            <!-- Error Message / Permission Modal -->
            <div v-if="showMessageModal" class="message-box z-30">
                <i class="far fa-exclamation-triangle fa-2x text-red-400 mb-3"></i>
                <p class="text-sm">{{ messageTextModal }}</p>
                <button @click="closeMessageModal" class="mt-4 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md text-xs">OK</button>
            </div>

            <!-- Camera Overlay UI, shown when stream should be active (controlled by parent via #cameraFeed display) -->
            <!-- We add v-if="streamActive" here to ensure controls only show if camera init was successful -->
            <div v-if="streamActive" class="camera-overlay z-10">
                <div class="camera-top-bar">
                    <button @click="navigateTo('MainAppHub')" class="text-2xl p-2"><i class="far fa-times"></i></button>
                    <button class="text-2xl p-2"><i class="far fa-bolt"></i></button> <!-- Flash icon -->
                </div>
                <div class="camera-bottom-controls">
                     <button class="text-2xl p-2"><i class="far fa-images"></i></button> <!-- Gallery/Upload icon -->
                    <div class="capture-ring" @click="takePicture">
                        <div class="capture-inner-dot"></div>
                    </div>
                    <button class="text-2xl p-2"><i class="far fa-sync-alt"></i></button> <!-- Flip camera icon -->
                </div>
            </div>
            <!-- Fallback if camera feed element isn't displaying but this screen is active -->
             <div v-if="!streamActive && !cameraError && !showMessageModal" class="absolute inset-0 flex flex-col items-center justify-center z-0">
                <i class="far fa-spinner fa-spin fa-3x text-gray-500"></i>
                <p class="mt-2 text-gray-500">Initializing Camera...</p>
            </div>
        </div>
    `
};

// --- DecodeScreen Component (Screen E - Display Decoded Art) ---
const DecodeScreen = {
    props: ['navigateTo', 'routeParams'], 
    setup(props) {
        const defaultImageUrl = "images/Koramangala.jpeg"; 
        const defaultTitle = "Koramangala Street Art";
        const defaultAlt = "Graffiti art from Koramangala featuring two stylized female figures and text 'The F Word Feminist is not a BAD ANGRY WORD' and 'Fearlessly Reclaim the Streets'.";

        const imageUrl = computed(() => props.routeParams?.imageUrl || defaultImageUrl);
        const artTitle = computed(() => props.routeParams?.artTitle || defaultTitle);
        const artAlt = computed(() => props.routeParams?.alt || defaultAlt);

        const dekkosTake = ref("This vibrant piece screams empowerment directly from the streets of Koramangala! It's a bold statement, challenging norms with its raw energy and unapologetic message. The art style is reminiscent of contemporary street art with folk influences, making complex ideas accessible and in-your-face.");
        const essence = ref({
            Movement: "Contemporary Street Art / Folk Fusion",
            Mood: "Empowering, Bold, Rebellious",
            Colors: "Vibrant purples, pinks, blues, with strong black outlines",
            Keywords: "Feminism, Street Art, Empowerment, Bangalore, Reclaim The Streets"
        });

        return { imageUrl, artTitle, artAlt, dekkosTake, essence, navigateTo: props.navigateTo };
    },
    template: `
        <div class="flex-grow flex flex-col items-center p-4 h-full text-center overflow-y-auto">
            <img :src="imageUrl" :alt="artAlt" class="w-full max-w-md rounded-md mb-4 border border-gray-300">
            <h3 class="text-xl font-bold mb-1">{{ artTitle }}</h3>
            
            <div class="bg-gray-100 p-3 rounded-md text-left text-sm mb-3 w-full max-w-md">
                <p class="font-semibold mb-1 text-black">Dekko's Take:</p>
                <p class="text-gray-800">{{ dekkosTake }}</p>
            </div>
            
            <div class="bg-gray-100 p-3 rounded-md text-left text-sm mb-4 w-full max-w-md">
                <p class="font-semibold mb-1 text-black">ESSENCE:</p>
                <p class="text-gray-800"><strong>Movement:</strong> {{ essence.Movement }}</p>
                <p class="text-gray-800"><strong>Mood:</strong> {{ essence.Mood }}</p>
                <p class="text-gray-800"><strong>Colors:</strong> {{ essence.Colors }}</p>
                <p class="text-gray-800"><strong>Keywords:</strong> {{ essence.Keywords }}</p>
            </div>
            
            <button @click="navigateTo('RemixScreen', { originalImageUrl: imageUrl, originalTitle: artTitle, originalAlt: artAlt })" 
                    class="bg-black text-white px-8 py-3 rounded-md font-semibold mb-2 w-full max-w-md hover:bg-gray-800 transition-colors">
                <i class="far fa-magic mr-2"></i>Remix This Art
            </button>
            <button @click="navigateTo('MainAppHub')" class="text-xs text-gray-500 w-full max-w-md py-2">Back to Home</button>
        </div>
    `
};

// --- RemixScreen Component (Screen F - Apply Filters) ---
const RemixScreen = {
    props: ['navigateTo', 'routeParams'],
     setup(props) {
        const originalImageUrl = computed(() => props.routeParams?.originalImageUrl || "images/Koramangala.jpeg");
        const originalTitle = computed(() => props.routeParams?.originalTitle || "Koramangala Street Art");
        const artToRemixAlt = computed(() => props.routeParams?.originalAlt || "Graffiti art from Koramangala.");

        const remixedImageUrl = ref(originalImageUrl.value); 

        // Updated art movements based on user's screenshot
        const styles = ref([
            { name: "Dada", icon: "far fa-puzzle-piece", id: "dada" },
            { name: "Pointillism", icon: "far fa-braille", id: "pointillism" },
            { name: "Realism", icon: "far fa-portrait", id: "realism" },
            { name: "Expressionism", icon: "far fa-angry", id: "expressionism" },
            { name: "Post-Impressionism", icon: "far fa-palette", id: "postimpressionism" },
            { name: "Conceptual", icon: "far fa-lightbulb", id: "conceptual" },
            { name: "Surrealism", icon: "far fa-surreal", icon: "far fa-dizzy", id: "surrealism" }, // far fa-eye-slash or fa-dizzy
            { name: "Art Nouveau", icon: "far fa-leaf", id: "artnouveau" }, // far fa-spa or fa-feather-alt
            { name: "Minimalism", icon: "far fa-square", id: "minimalism" }, // far fa-minus-square
            { name: "Pop Art", icon: "far fa-star", id: "popart" },
            { name: "Cubism", icon: "far fa-cubes", id: "cubism" },
            { name: "Abstract Expressionism", icon: "far fa-random", id: "abex" } // far fa-signature or fa-paint-roller
        ]);

        function applyStyle(styleId) {
            console.log(`Applied style: ${styleId}. (Remix simulation)`);
            alert(`Remix style '${styleId}' applied (simulated).`);
        }
         function saveRemix() {
            console.log("Remix saved (simulated). Image:", remixedImageUrl.value);
            alert("Remix saved to your collection (simulated)!");
            props.navigateTo('DecodeScreen', { imageUrl: remixedImageUrl.value, artTitle: `Remixed: ${originalTitle.value}` });
        }

        return { originalImageUrl, artToRemixAlt, remixedImageUrl, styles, applyStyle, saveRemix, navigateTo: props.navigateTo, originalTitle };
    },
    template: `
         <div class="flex-grow flex flex-col items-center p-4 h-full text-center overflow-y-auto">
            <h2 class="text-2xl font-bold mb-2">Remix Studio</h2>
            <p class="text-sm text-gray-600 mb-3">Style: {{ originalTitle }}</p>
            <img :src="remixedImageUrl" :alt="artToRemixAlt" class="w-full max-w-md rounded-md mb-4 border border-gray-300">
            
            <p class="text-sm mb-2 font-semibold">Apply an Art Style:</p>
            <div class="grid grid-cols-3 gap-2 mb-6 w-full max-w-md">
                <button v-for="style in styles" :key="style.id"
                        @click="applyStyle(style.id)"
                        class="bg-gray-200 p-3 rounded-md text-xs hover:bg-gray-300 transition-colors flex flex-col items-center justify-center aspect-square">
                    <i :class="style.icon + ' fa-2x mb-1'"></i>
                    <span>{{ style.name }}</span>
                </button>
            </div>
            
            <button @click="saveRemix" class="bg-black text-white px-8 py-3 rounded-md font-semibold mb-2 w-full max-w-md hover:bg-gray-800 transition-colors">
                <i class="far fa-save mr-2"></i>Save Remix
            </button>
            <button @click="navigateTo('DecodeScreen', { imageUrl: originalImageUrl, artTitle: originalTitle, alt: artToRemixAlt })" class="text-xs text-gray-500 w-full max-w-md py-2">Back to Decode</button>
        </div>
    `
};

// --- PublicGalleryScreen Component (Placeholder) ---
const PublicGalleryScreen = {
    props: ['navigateTo', 'appState'],
    setup(props) {
        const galleryItems = ref([ 
            { id: 'g1', title: "Community Remix 1", user: "ArtFan01", imageUrl: "images/Koramangala.jpeg", alt: "Koramangala graffiti remix" }, // Using local image
            { id: 'g2', title: "Street Art Decode", user: "UrbanExplorer", imageUrl: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/2/2015/10/Featured3.jpg?fm=webp&w=750&h=500&dpr=2", alt: "Street art from LBB" },
            { id: 'g3', title: "My Abstract Take", user: "CreativeSoul", imageUrl: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/2/2015/12/Malleshwaram.jpeg?fm=webp&w=750&h=500&dpr=2", alt: "Malleshwaram street art" },
            { id: 'g4', title: "Monochrome Mood", user: "ShadowWalker", imageUrl: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/2/2015/10/Ullas-Hydoor.jpeg?fm=webp&w=750&h=500&dpr=2", alt: "Ullas Hydoor street art" },
        ]);
        const userPersonaImage = computed(() => props.appState?.userPersonaImage || 'https://placehold.co/40x40/CCCCCC/000000?text=U');

        return { galleryItems, userPersonaImage };
    },
    template: `
    <div class="flex-grow flex flex-col h-full">
        <header class="p-4 flex justify-between items-center border-b border-gray-200">
            <h1 class="text-xl font-bold">Public Gallery</h1>
             <img :src="userPersonaImage" alt="User persona" class="w-8 h-8 rounded-full object-cover">
        </header>
        <div class="flex-grow p-4 overflow-y-auto pb-36">
            <div v-if="galleryItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="item in galleryItems" :key="item.id" 
                     @click="navigateTo('DecodeScreen', { imageUrl: item.imageUrl, artTitle: item.title, alt: item.alt })"
                     class="cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                    <img :src="item.imageUrl" :alt="item.alt" class="w-full h-full object-cover">
                </div>
            </div>
            <p v-else class="text-gray-500">The gallery is currently empty.</p>
        </div>
         <nav class="bottom-tab-bar">
            <button @click="navigateTo('MainAppHub')" class="focus:outline-none">
                <i class="far fa-album-collection"></i>
            </button>
            <button @click="navigateTo('CaptureScreen')" class="focus:outline-none camera-button-stack">
                <i class="fa-regular fa-camera-polaroid"></i>
            </button>
            <button @click="navigateTo('PublicGalleryScreen')" class="focus:outline-none">
                <i class="fa-brands fa-galactic-republic"></i>
            </button>
        </nav>
    </div>
    `
};


// --- Create and Mount the Vue App ---
const app = createApp({
    setup() {
        const currentPage = ref('WelcomeScreen'); 
        const routeParams = ref({}); 
        const appState = ref({ 
            userPersonaImage: 'https://placehold.co/40x40/CCCCCC/000000?text=U',
            userTasteProfile: [] // To store results from OnboardingB1
        });

        function navigateTo(pageName, params = {}) {
            console.log(`Navigating to ${pageName} with params:`, params);
            
            const oldPage = currentPage.value;
            currentPage.value = pageName;
            routeParams.value = params;

            if (params.userPersonaImage) {
                appState.value.userPersonaImage = params.userPersonaImage;
            }
            if (params.tasteSelections) { // Store taste profile
                appState.value.userTasteProfile = params.tasteSelections;
            }

            const cameraFeedElement = document.getElementById('cameraFeed');
            if (cameraFeedElement) {
                if (pageName === 'CaptureScreen') {
                    // Attempt to start camera only when navigating TO CaptureScreen
                    // The CaptureScreen component's onMounted will handle the actual start
                    cameraFeedElement.style.display = 'block';
                } else if (oldPage === 'CaptureScreen' && pageName !== 'CaptureScreen') {
                    // If navigating AWAY from CaptureScreen, ensure camera is stopped by CaptureScreen's onUnmounted
                    // and hide the feed element.
                     cameraFeedElement.style.display = 'none';
                } else if (pageName !== 'CaptureScreen') {
                    cameraFeedElement.style.display = 'none';
                }
            }
        }
        
        onMounted(() => {
            const cameraFeedElement = document.getElementById('cameraFeed');
            if (cameraFeedElement) {
                cameraFeedElement.style.display = 'none'; // Ensure it's hidden initially
            }
        });

        return { currentPage, navigateTo, routeParams, appState };
    },
    components: {
        WelcomeScreen,
        OnboardingScreenB1,
        OnboardingScreenB2,
        OnboardingScreenB3,
        MainAppHub,
        CaptureScreen,
        DecodeScreen,
        RemixScreen,
        PublicGalleryScreen
    },
    template: `
        <component :is="currentPage" :navigate-to="navigateTo" :route-params="routeParams" :app-state="appState"></component>
    `
});

app.mount('#app');
