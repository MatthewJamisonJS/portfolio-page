# Matthew Jamison - Portfolio Site

A personal portfolio website built with Hugo and the Meghna theme. This site showcases my work as a full-stack developer with experience in Rails, Python, AI tooling, and music creation.

## Project Overview

- **Framework**: Hugo static site generator
- **Theme**: Meghna
- **Language**: English (en-us)
- **Timezone**: America/Chicago

## Customizations

### Custom Templates Overridden

The following templates have been customized to extend or modify the theme's default behavior:

1. **`layouts/index.html`**
   - Main homepage layout
   - Custom homepage structure and styling

2. **`layouts/partials/banner.html`**
   - Hero section banner
   - Custom banner presentation

3. **`layouts/partials/contact.html`**
   - Contact form section
   - Customized contact functionality

4. **`layouts/partials/footer.html`**
   - Site footer
   - Custom footer content and styling

5. **`layouts/partials/navigation.html`**
   - Main navigation bar
   - Custom navigation structure

6. **`layouts/partials/bg-image.html`**
   - Background image partial
   - Custom background handling

7. **`layouts/partials/image.html`**
   - Image display partial
   - Customized image rendering

8. **`layouts/partials/music-widget.html`**
   - Music player widget
   - Custom Bandcamp music integration

### Custom CSS Added

**File**: `assets/css/custom.css`

- **Pokemon Animations**: Custom CSS animations for Pokemon-themed elements
- Theme color overrides and custom styling
- Enhanced visual effects and transitions
- Responsive design improvements

### Configuration Changes

The project uses Hugo's configuration directory structure with environment-specific settings:

#### Production Configuration
**File**: `config/production/hugo.toml`
- `baseURL = "/"` - Production domain root
- Full production settings and parameters

#### Development Configuration
**File**: `config/development/hugo.toml`
- `baseURL = "http://localhost:1313/"` - Local development server
- Development-optimized settings

#### Main Configuration
**File**: `hugo.toml` (root)
- Default configuration with baseline settings
- Shared configuration across environments

### Build Configuration

The project includes optimized build settings:

- **Build Stats**: Enabled for performance monitoring
- **Cache Busters**: Configured for JS, CSS, and other assets
- **Resource Caching**: Configured for images and assets (720-hour cache)
- **Image Quality**: Set to 90 for optimal quality/size balance

### Plugin Dependencies

#### CSS Plugins
- Bootstrap (bootstrap.min.css)
- Themify Icons (themify-icons.css)
- Magnific Popup (magnific-popup.css)
- Slick Carousel (slick.css)
- Google Fonts: Anaheim, Quattrocento Sans

#### JavaScript Plugins
- jQuery
- Bootstrap JS
- Slick Carousel JS
- Shuffle JS
- Magnific Popup JS
- Lazy Load (Lozad)

## Directory Structure

```
portfolio-page/
├── archetypes/          # Hugo content archetypes
├── assets/
│   └── css/
│       └── custom.css   # Custom CSS with Pokemon animations
├── config/              # Environment-specific configurations
│   ├── production/
│   │   └── hugo.toml
│   └── development/
│       └── hugo.toml
├── content/
│   └── english/         # English language content
├── data/                # Hugo data files
├── i18n/                # Internationalization files
├── layouts/             # Custom templates (overrides)
│   ├── index.html
│   └── partials/
│       ├── banner.html
│       ├── bg-image.html
│       ├── contact.html
│       ├── footer.html
│       ├── image.html
│       ├── music-widget.html
│       └── navigation.html
├── static/              # Static assets (images, etc.)
├── themes/
│   └── meghna/          # Main theme directory
├── hugo.toml            # Root configuration
└── .gitignore           # Git ignore rules
```

## Development

### Prerequisites

- Hugo (extended version recommended)
- Git

### Running Locally

To run the development server with local configuration:

```bash
# Using development configuration
hugo server --environment development --watch

# Or simply
hugo server
```

The site will be available at `http://localhost:1313/`

### Building for Production

```bash
# Build with production configuration
hugo --environment production --minify

# Output goes to /public directory
```

### Environment-Specific Usage

Hugo will automatically use the appropriate configuration based on the `--environment` flag:
- **Development**: Uses `config/development/hugo.toml` with localhost baseURL
- **Production**: Uses `config/production/hugo.toml` with production baseURL

## Social Links

- **GitHub**: [MatthewJamisonJS](https://github.com/MatthewJamisonJS)
- **LinkedIn**: [matthew-jamison-65486bab](https://www.linkedin.com/in/matthew-jamison-65486bab/)
- **Music**: [matthewjjamison](https://matthewjjamison.bandcamp.com/)

## License

Personal portfolio site - All rights reserved.
