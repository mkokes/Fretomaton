# Fretomaton

A React application for generating precise, printable fretboard templates for guitars, basses, ukuleles, and other stringed instruments. This tool helps instrument makers and luthiers create accurate templates for woodworking projects.

## Features

- **Precise Calculations**: Uses standard equal temperament formulas for mathematically accurate fret positioning
- **Multiple Instruments**: Supports electric guitars, acoustic guitars, classical guitars, bass guitars, and ukuleles with preset configurations
- **Dual Unit System**: Work in metric (mm) or imperial (inches) with real-time conversion
- **Print-Ready Output**: Generates SVG templates with verified 1:1 scale accuracy for direct use as cutting guides
- **Real-Time Preview**: See your fretboard template update as you adjust parameters
- **Comprehensive Validation**: Built-in validation ensures realistic and buildable measurements
- **Responsive Design**: Works on desktop and tablet devices
- **Preset Management**: Quick setup with industry-standard instrument configurations

## Technology Stack

- **React 18+** with functional components and hooks
- **TypeScript** for type safety and better development experience
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling and responsive design
- **Vitest** for comprehensive unit testing
- **ESLint** with React-specific configuration
- **Yarn** for package management

## Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fretomaton
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally
- `yarn test` - Run unit tests
- `yarn test:ui` - Run tests with UI interface
- `yarn test:run` - Run tests once without watch mode
- `yarn lint` - Run ESLint checks
- `yarn deploy` - Build and deploy to production server
- `yarn deploy:simple` - Build and show deployment command

## Deployment

### Environment Setup

1. **Configure deployment settings**:
```bash
cp .env.example .env
```

2. **Edit `.env` with your server details**:
```bash
# Deployment Configuration
DEPLOY_REMOTE_USER=your_username
DEPLOY_REMOTE_HOST=your.server.ip.address
DEPLOY_REMOTE_PATH=/path/to/your/web/directory
DEPLOY_LOCAL_DIST_PATH=./dist/

# Build Configuration
# The subfolder path where the app will be deployed
# Use "/" for root deployment or "/subfolder" for subfolder deployment
VITE_BASE_PATH=/fretomaton
```

### Subfolder Deployment

If your application will be deployed to a subfolder (e.g., `https://yourdomain.com/fretomaton/`), configure the `VITE_BASE_PATH` environment variable:

- **Root deployment**: Set `VITE_BASE_PATH=/` or leave it empty
- **Subfolder deployment**: Set `VITE_BASE_PATH=/your-subfolder-name`

This ensures that all asset paths (JavaScript, CSS, images) are correctly prefixed for your deployment location. The build process will automatically adjust all asset URLs to work with your subfolder configuration.

### Automated Deployment

The project includes deployment scripts for easy production deployment:

1. **Full Deployment** (runs tests, builds, and deploys):
```bash
yarn deploy
# or
./deploy.sh
```

2. **Simple Deployment** (runs tests, builds, shows rsync command):
```bash
yarn deploy:simple
# or
./deploy-simple.sh
```

3. **Debug Deployment** (verbose output for troubleshooting):
```bash
./deploy-debug.sh
```

4. **Check Remote Server** (inspect current deployment):
```bash
./check-remote.sh
```

### Manual Deployment

1. Build the project:
```bash
yarn build
```

2. Deploy using rsync (replace with your server details):
```bash
rsync -avz --delete --progress ./dist/ username@server:/path/to/web/directory/
```

The deployment scripts will:
- Load configuration from `.env` file
- Run all tests to ensure code quality
- Build the project for production
- Deploy to the configured server using rsync
- Show deployment status and summary

**Note**: The `.env` file is excluded from git for security. Make sure to configure it on each environment where you want to deploy.

### Troubleshooting Deployment

#### 404 Errors for Assets (JS/CSS files)

If you see 404 errors for JavaScript or CSS files after deployment, this usually indicates an incorrect `VITE_BASE_PATH` configuration:

1. **Check your deployment URL**: If your app is accessible at `https://yourdomain.com/fretomaton/`, ensure `VITE_BASE_PATH=/fretomaton`
2. **Rebuild after changing `.env`**: Always run `yarn build` after updating the `VITE_BASE_PATH` value
3. **Verify asset paths**: Check the built `dist/index.html` file - asset paths should match your deployment structure

#### Common Base Path Examples

```bash
# Root deployment (https://yourdomain.com/)
VITE_BASE_PATH=/

# Single subfolder (https://yourdomain.com/fretomaton/)
VITE_BASE_PATH=/fretomaton

# Nested subfolder (https://yourdomain.com/tools/fretomaton/)
VITE_BASE_PATH=/tools/fretomaton
```

#### SSH Connection Issues

If deployment fails with SSH errors:

1. **Test SSH connection**: `ssh username@hostname`
2. **Check SSH key setup**: Ensure your SSH key is added to the server
3. **Verify server path**: Ensure the `DEPLOY_REMOTE_PATH` directory exists and is writable

## Usage Guide

### Basic Configuration

1. **Select an Instrument Preset**: Choose from 20+ presets including electric guitars, acoustic guitars, bass guitars, classical guitars, and ukuleles for quick setup
2. **Adjust Scale Length**: Set the distance from nut to bridge (typically 11-22" for ukuleles, 24-26" for guitars, 30-35" for basses)
3. **Configure String Spacing**: Set spacing between string centers at both nut and bridge
4. **Set Neck Width**: Define the width of the neck at nut and bridge
5. **Choose Fret Count**: Select how many frets to include (1-24 range)
6. **Set Fret Wire Width**: Adjust the thickness of fret slots for your fret wire

### Advanced Options

- **Unit System**: Toggle between metric (mm) and imperial (inches) with real-time conversion
- **Real-time Preview**: See your fretboard template update instantly as you adjust parameters
- **SVG Output**: Scalable vector graphics ensure perfect print quality at any size

### Printing Instructions

1. Configure your instrument parameters and preview the template
2. Use your browser's print function (Ctrl+P or Cmd+P)
3. Configure print settings:
   - Paper size (A4 or US Letter)
   - Orientation (Landscape recommended for longer instruments)
4. **Critical**: Set printer to 100% scale (no scaling)
5. Print and verify accuracy by measuring the scale length on the printed template

## Project Structure

```
src/
├── data/               # Static data and presets
│   └── presets.json    # Instrument preset configurations
├── types/              # TypeScript type definitions
│   └── presets.ts      # Preset type definitions
├── tests/              # Unit tests
│   ├── unitConversion.test.tsx  # Unit conversion tests
│   ├── printScaling.test.tsx    # SVG scaling and print accuracy tests
│   └── setup.ts                 # Test configuration
├── App.tsx             # Main application component
├── App.test.tsx        # App component tests
├── SVG.test.tsx        # SVG template tests
├── App.css             # Application styles
├── index.css           # Global styles and print CSS
└── main.tsx            # Application entry point
```

### Deployment Files

```
├── deploy.sh           # Full automated deployment script
├── deploy-simple.sh    # Simple deployment with manual rsync
├── deploy-debug.sh     # Verbose deployment for troubleshooting
├── check-remote.sh     # Check current remote server state
├── .env.example        # Environment variables template
└── dist/               # Production build output (generated)
```

## Mathematical Accuracy

The application uses the standard equal temperament formula for fret positioning:

```
fret_position = scale_length - (scale_length / (2^(fret_number/12)))
```

This ensures that each fret produces a semitone interval, with the 12th fret positioned exactly at half the scale length (octave).

## Validation Rules

The application enforces realistic measurement ranges:

- **Scale Length**: 10-40 inches (254-1016mm) - covers ukuleles to extended range basses
- **Fret Count**: 1-24 frets
- **Neck Width**: 0.5-4 inches (12.7-101.6mm) - from narrow ukulele necks to wide bass necks
- **String Spacing**: 0.5-4 inches (12.7-101.6mm) - nut and bridge string spacing
- **Fret Wire Width**: 0.01-0.2 inches (0.254-5.08mm) - slot width for fret wire

## Preset Configurations

### Electric Guitars
- **Fender Standard**: 25.5" (648mm) scale - Stratocaster/Telecaster
- **Gibson Standard**: 24.75" (629mm) scale - Les Paul/SG
- **PRS Standard**: 25" (635mm) scale
- **Short Scale Electric**: 24" (610mm) scale

### Acoustic Guitars
- **Martin Standard**: 25.4" (645mm) scale
- **Taylor Standard**: 24.9" (632mm) scale
- **Gibson Acoustic**: 24.75" (629mm) scale
- **Parlor Guitar**: 23.5" (597mm) scale

### Classical Guitar
- **Classical Guitar**: 25.6" (650mm) scale

### Bass Guitars
- **Bass Long Scale**: 34" (864mm) scale
- **Bass Medium Scale**: 32" (813mm) scale
- **Bass Short Scale**: 30" (762mm) scale
- **Bass Extra Long Scale**: 35" (889mm) scale

### Ukuleles
- **Sopranino/Piccolo**: 11" (279mm) scale
- **Soprano**: 13" (330mm) scale
- **Concert**: 15" (381mm) scale
- **Tenor**: 17" (432mm) scale
- **Baritone**: 19" (483mm) scale
- **Bass Ukulele**: 20.5" (521mm) scale
- **Contrabass**: 22" (559mm) scale

## Testing

The project includes comprehensive unit tests covering:

- Fret position calculations
- Unit conversions
- Form validation
- Component behavior
- Custom hooks
- SVG scaling and print accuracy
- Print dimension verification

Run tests with:
```bash
yarn test
```

### Test Coverage

- **Mathematical Accuracy**: Verifies fret position calculations using equal temperament formulas
- **Unit Conversion**: Tests conversion between metric and imperial units
- **SVG Scaling**: Validates that SVG templates use correct 1:1 scale mapping
- **Print Verification**: Ensures SVG dimensions match real-world measurements
- **Component Integration**: Tests user interface components and interactions

## Print Quality Guidelines

For best results when printing templates:

1. **Printer Settings**: Use highest quality settings
2. **Paper**: Use heavy paper (cardstock) for durability
3. **Scaling**: Always print at 100% - never scale to fit
4. **Verification**: Measure the printed scale length to confirm accuracy
5. **SVG Quality**: The SVG format ensures crisp lines at any print size
6. **Accurate Dimensions**: SVG templates use 1:1 scale mapping (1 SVG unit = 1 inch) for precise printing

### Print Accuracy

The application has been specifically optimized for accurate 1:1 printing:

- **SVG Coordinate System**: Uses real-world measurements (inches) in the viewBox
- **Print-Specific CSS**: Removes responsive constraints during printing
- **Verified Scaling**: Templates print at true physical dimensions when set to 100% scale
- **Measurement Consistency**: Both the measurement table and SVG template use the same calculations

### Troubleshooting Print Issues

If your printed template doesn't match the expected dimensions:

1. **Check Printer Settings**: Ensure "Actual Size" or "100%" is selected, not "Fit to Page"
2. **Verify Browser Print Settings**: In print preview, confirm no scaling is applied
3. **Test with Measurement Table**: Print and measure values from the measurement table first
4. **Paper Size**: Use standard paper sizes (A4/Letter) for best results
5. **Browser Compatibility**: Use Chrome, Firefox, Safari, or Edge for optimal print rendering

**Expected Results**: When printed correctly, the scale length on your template should match the configured value exactly (e.g., 25.5" scale should measure exactly 25.5" on paper).

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Equal temperament mathematics based on standard musical theory
- Instrument measurements from traditional luthiery practices
- UI styling powered by Tailwind CSS
- Testing framework provided by Vitest
- SVG rendering for precise, scalable templates

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

**⚠️ Important Safety Note**: Always verify measurements with a ruler before cutting expensive wood. While this tool has been optimized for 1:1 print accuracy and extensively tested, physical verification is essential for precision woodworking. Test print a small section first to confirm your printer settings produce accurate dimensions.
