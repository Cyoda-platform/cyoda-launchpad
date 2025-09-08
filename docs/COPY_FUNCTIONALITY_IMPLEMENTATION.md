# Copy Functionality and Scrollable Containers Implementation

## Overview

This document describes the implementation of copy functionality and scrollable containers for code blocks and copyable content sections in the markdown rendering system.

## Features Implemented

### 1. Copy Functionality for Code Blocks
- **Copy Button**: All code blocks now have a copy button that appears on hover
- **Visual Feedback**: Copy button shows a checkmark when content is copied successfully
- **Fallback Support**: Includes fallback for older browsers that don't support the Clipboard API
- **Language Labels**: Code blocks display the programming language when specified

### 2. Scrollable Containers
- **Maximum Height**: Long code blocks are limited to 400px height with vertical scrolling
- **Automatic Detection**: Scrolling is automatically enabled for code blocks with more than 15 lines
- **Line Numbers**: Long code blocks (>10 lines) automatically show line numbers for better readability

### 3. Copyable Text Blocks
- **Smart Detection**: Automatically detects copyable content patterns in blockquotes and paragraphs
- **Pattern Recognition**: Recognizes prompts, commands, and configuration examples
- **Visual Variants**: Different styling for different content types (prompts, commands, code)

## Components Created

### CopyableCodeBlock.tsx
A React component that wraps code blocks with copy functionality and scrollable containers.

**Features:**
- Copy button with hover effects
- Automatic scrolling for long content
- Language detection and labeling
- Line numbers for long code blocks
- Syntax highlighting with react-syntax-highlighter

### CopyableTextBlock.tsx
A React component for copyable text content outside of code blocks.

**Features:**
- Pattern-based content detection
- Visual variants (prompt, command, code)
- Scrollable containers for long text
- Copy functionality with fallback support

## Pattern Detection

The system automatically detects copyable content using these patterns:

### Prompt Patterns
- Text starting with "copy this", "use this prompt", "prompt:"
- Text containing "generate", "create", "build" followed by "using"
- Text starting with "here's the prompt", "this prompt"

### Command Patterns
- Shell commands: `curl`, `npm`, `yarn`, `pip`, `docker`, `git`, etc.
- System commands: `sudo`, `chmod`, `mkdir`, `cd`, `ls`, etc.
- Command prefixes: `$`, `#`

### Configuration Patterns
- Long text blocks (>100 characters) containing newlines or equals signs
- JSON, YAML, or other structured configuration formats

## Usage

### In Markdown Files

#### Code Blocks
```javascript
// This will automatically have copy functionality
function example() {
  return "Hello, World!";
}
```

#### Copyable Commands in Blockquotes
> curl http://localhost:8080/api/data

#### Long Prompts
> Copy this entire prompt into your AI tool:
> Generate a comprehensive application that handles user authentication, data processing, and real-time updates using modern web technologies.

## Technical Implementation

### MarkdownRenderer Updates
The `MarkdownRenderer.tsx` component was updated to:
1. Import the new copyable components
2. Replace the standard code block rendering with `CopyableCodeBlock`
3. Enhance blockquote and paragraph rendering with pattern detection
4. Maintain backward compatibility for non-copyable content

### Utility Functions
- `detectCopyableContent()`: Analyzes text content to determine if it should be copyable
- `extractTextFromChildren()`: Recursively extracts text content from React children

### Styling
- Uses existing design system colors and components
- Consistent with the application's dark/light theme support
- Hover effects and transitions for better user experience
- Responsive design for mobile and desktop

## Browser Compatibility

### Modern Browsers
- Uses the Clipboard API (`navigator.clipboard.writeText()`)
- Provides immediate feedback and better security

### Legacy Browser Support
- Falls back to `document.execCommand('copy')` method
- Creates temporary textarea elements for copying
- Maintains functionality across all supported browsers

## Performance Considerations

- **Lazy Loading**: Copy functionality is only activated on user interaction
- **Efficient Pattern Matching**: Uses optimized regex patterns for content detection
- **Minimal Re-renders**: Components are optimized to prevent unnecessary re-renders
- **Memory Management**: Temporary DOM elements are properly cleaned up

## Testing

A test guide has been created at `src/docs/guides/copy_functionality_test.md` that demonstrates:
- Various code block types and lengths
- Different copyable content patterns
- Expected behavior and visual feedback
- Browser compatibility scenarios

## Future Enhancements

Potential improvements that could be added:
1. **Custom Copy Formats**: Allow copying code with or without line numbers
2. **Batch Copy**: Select and copy multiple code blocks at once
3. **Copy History**: Track recently copied content
4. **Keyboard Shortcuts**: Add keyboard shortcuts for copy operations
5. **Analytics**: Track which content is copied most frequently

## Configuration Options

The components accept various props for customization:
- `maxHeight`: Maximum height for scrollable containers
- `showLineNumbers`: Force show/hide line numbers
- `variant`: Visual variant for text blocks (prompt, command, code)
- `label`: Custom label for content type

## Dependencies

The implementation uses existing project dependencies:
- `react-syntax-highlighter`: For code syntax highlighting
- `lucide-react`: For copy and check icons
- `@radix-ui/react-scroll-area`: For scrollable containers
- Existing UI components from the shadcn/ui library
