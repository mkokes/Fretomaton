# Fretomaton

A React application for generating precise, printable fretboard templates for ukuleles and guitars. This tool helps instrument makers and luthiers create accurate templates for woodworking projects.

## Features

- **Precise Calculations**: Uses standard equal temperament formulas for mathematically accurate fret positioning
- **Multiple Instruments**: Supports both ukuleles and guitars with preset configurations
- **Dual Unit System**: Work in metric (mm) or imperial (inches) with real-time conversion
- **Print-Ready Output**: Generates templates at true 1:1 scale for direct use as cutting guides
- **Multi-Page Support**: Automatically splits long templates across multiple pages with alignment marks
- **Real-Time Preview**: See your fretboard template update as you adjust parameters
- **Comprehensive Validation**: Built-in validation ensures realistic and buildable measurements
- **Responsive Design**: Works on desktop and tablet devices

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

### Setup

1. **Configure deployment settings**:
```bash
cp .env.example .env
```

2. **Edit `.env` with your server details**:
```bash
DEPLOY_REMOTE_USER=your_username
DEPLOY_REMOTE_HOST=your.server.ip.address
DEPLOY_REMOTE_PATH=/path/to/your/web/directory
DEPLOY_LOCAL_DIST_PATH=./dist/
```

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

## Usage Guide

### Basic Configuration

1. **Select an Instrument Preset**: Choose from Concert Ukulele, Tenor Ukulele, Acoustic Guitar, or Classical Guitar for quick setup
2. **Adjust Scale Length**: Set the distance from nut to bridge (typically 15-17" for ukuleles, 24-26" for guitars)
3. **Configure String Spacing**: Set spacing between string centers at both nut and bridge
4. **Set Fretboard Dimensions**: Define the width of the fretboard at nut and bridge
5. **Choose Fret Count**: Select how many frets to include (1-24 range)

### Advanced Options

- **Unit System**: Toggle between metric (mm) and imperial (inches)
- **String Compensation**: Enable slight adjustments for different string gauges
- **Fret Wire Width**: Adjust the thickness of fret slots

### Printing Instructions

1. Click the "Print Template" button
2. Configure print settings:
   - Paper size (A4 or US Letter)
   - Orientation (Landscape recommended)
3. **Critical**: Set printer to 100% scale (no scaling)
4. Verify accuracy by measuring the ruler on the printed template
5. For multi-page templates, carefully align pages using the overlap marks

## Project Structure

```
src/
├── data/               # Static data and presets
│   └── presets.json    # Instrument preset configurations
├── types/              # TypeScript type definitions
│   └── presets.ts      # Preset type definitions
├── tests/              # Unit tests
│   ├── unitConversion.test.tsx
│   └── setup.ts
├── App.tsx             # Main application component
├── App.test.tsx        # App component tests
├── SVG.test.tsx        # SVG template tests
└── main.tsx            # Application entry point
```

### Deployment Files

```
├── deploy.sh           # Full automated deployment script
├── deploy-simple.sh    # Simple deployment with manual rsync
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

- **Scale Length**: 300-700mm (11.8-27.6 inches)
- **String Count**: 4-6 strings
- **Fret Count**: 1-24 frets
- **String Spacing**: 8-15mm (0.31-0.59 inches)
- **Fretboard Width**: 30-70mm (1.18-2.76 inches)
- **Fret Wire Width**: 1-3mm (0.04-0.12 inches)

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

Run tests with:
```bash
yarn test
```

## Print Quality Guidelines

For best results when printing templates:

1. **Printer Settings**: Use highest quality settings
2. **Paper**: Use heavy paper (cardstock) for durability
3. **Scaling**: Always print at 100% - never scale to fit
4. **Verification**: Measure the printed ruler to confirm accuracy
5. **Multi-page**: Use alignment marks for precise page joining

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
- UI components powered by Ant Design
- Testing framework provided by Vitest

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

**⚠️ Important Safety Note**: Always verify measurements with a ruler before cutting expensive wood. This tool is designed to be accurate, but physical verification is essential for precision woodworking.
