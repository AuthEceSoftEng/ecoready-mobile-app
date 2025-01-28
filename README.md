# Development Guide for My App

This document provides instructions for setting up the development environment and running the app using **Expo Go** or a **Development APK**.

---

## Prerequisites

Make sure you have the following tools installed:

```
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Expo CLI](https://expo.dev/)
- `npm` 16+
- [Git](https://git-scm.com/)
```

---

## Getting Started

Follow these steps to clone the repository and run the app:

```
# Clone the repository
git clone https://https://github.com/AuthEceSoftEng/ecoready-mobile-app.git

# Navigate to the project directory
cd my-app

# Install dependencies
npm install
```

---

## Running the App

There are two ways to run the app for development:

### 1. **Using Expo Go**

```
# Start the app in development mode
npx expo start
```

1. Open the Expo Go app on your device.
2. Scan the QR code displayed in the terminal or browser.
3. Changes in your JavaScript code will reload automatically in Expo Go.

---

### 2. **Using a Development APK**

This method allows you to test native modules or features that are not supported by **Expo Go**.

```
# Build a development APK
eas build --profile development --platform android

# Install the APK on your device
adb install <path-to-apk>
```

1. Run the command above to build an APK.
2. Install the APK on your device using `adb install`.
3. Open the app on your device.

---

## Testing Changes

During development, you can see changes as follows:

```
- **Expo Go**: Changes in JavaScript code will reload automatically.
- **Development APK**: If you modify native modules or `app.json`, you must rebuild the APK.
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
