
# Figma Export Guidelines

## Exporting Components from Figma

1. Select the component or frame you want to export
2. In the right panel, click on "Export"
3. Choose SVG format for icons and vectors
4. Choose PNG format with 2x resolution for images
5. Click "Export"

## Importing to the Project

Place exported assets in the appropriate folders:
- Icons: `/src/assets/icons/`
- Images: `/src/assets/images/`
- Logos: `/src/assets/logos/`

## Design Tokens

Design tokens (colors, typography, spacing) should be exported as JSON and converted to Tailwind CSS format using the design token converter script.

## Component Specifications

When implementing components, refer to the detailed specifications available in the Figma file, including:
- Spacing
- Typography
- Colors
- States (hover, active, disabled)
- Animations
- Responsive behavior
