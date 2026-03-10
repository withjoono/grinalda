# Package.json Optimization Plan

## UI Library Consolidation Strategy

### Current State Analysis
**Redundant UI Libraries (causing ~2MB bundle increase):**
- ❌ Bootstrap 5.3.0 + React-Bootstrap 2.8.0 (old paradigm)
- ❌ MUI Material + Emotion (large bundle size)
- ✅ Radix UI (modern, accessible, keep)
- ✅ Tailwind CSS (utility-first, keep)

### Optimization Plan

#### Phase 1: Remove Redundant Libraries
```json
"dependencies": {
  // REMOVE (Bootstrap ecosystem)
  "bootstrap": "^5.3.0",                    // ❌ Remove
  "react-bootstrap": "^2.8.0",             // ❌ Remove
  
  // REMOVE (MUI ecosystem - too heavy for this use case)  
  "@emotion/react": "^11.11.1",            // ❌ Remove
  "@emotion/styled": "^11.11.0",           // ❌ Remove
  "@mui/icons-material": "^5.11.16",       // ❌ Remove  
  "@mui/material": "^5.12.3",              // ❌ Remove
  "@mui/system": "^5.14.1",                // ❌ Remove
  
  // REMOVE (Redundant icon libraries)
  "@react-icons/all-files": "^4.1.0",      // ❌ Remove (use Lucide React)
  "iconify": "^1.4.0",                     // ❌ Remove (use Lucide React)
  
  // REMOVE (Redundant chart libraries)
  "chart.js": "^4.4.1",                    // ❌ Remove (keep Recharts + Nivo)
  "react-chartjs-2": "^5.2.0",             // ❌ Remove
  
  // REMOVE (Old table library)
  "react-table": "^7.8.0",                 // ❌ Remove (use @tanstack/react-table)
  
  // KEEP (Modern, performant libraries)
  "@radix-ui/*": "...",                    // ✅ Keep (accessible, unstyled)
  "tailwindcss": "^3.4.3",                // ✅ Keep (utility-first)
  "lucide-react": "^0.379.0",             // ✅ Keep (consistent icons)
  "@tanstack/react-table": "^8.9.3",      // ✅ Keep (modern table)
  "recharts": "^2.7.2",                   // ✅ Keep (React charts)
  "@nivo/*": "...",                        // ✅ Keep (advanced charts)
}
```

#### Phase 2: Migration Strategy
1. **Bootstrap → Tailwind + Radix UI**
   - Replace Bootstrap classes with Tailwind utilities
   - Use Radix UI for complex components (modals, dropdowns)

2. **MUI → Tailwind + Radix UI**
   - Replace MUI components with custom Tailwind-styled components
   - Use Radix UI for accessibility

3. **Multiple Chart Libraries → Recharts + Nivo**
   - Standardize on Recharts for simple charts
   - Use Nivo for complex visualizations

#### Expected Benefits
- **Bundle Size**: ~2MB reduction (40-50% smaller)
- **Performance**: Faster load times, better tree-shaking
- **Consistency**: Single design system approach
- **Maintenance**: Fewer dependency conflicts

#### Risk Assessment
- **High**: Requires extensive component refactoring
- **Medium**: May break existing layouts initially
- **Mitigation**: Gradual migration with fallbacks

## Implementation Priority
1. **Phase 1a**: Remove unused chart libraries (low risk)
2. **Phase 1b**: Remove icon library duplicates (low risk)
3. **Phase 1c**: Remove Bootstrap (medium risk)
4. **Phase 1d**: Remove MUI (high risk - requires component migration)