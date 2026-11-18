// Dev-only page that renders the 1200x630 social preview image (public/og-image.png).
// Not part of the production build; see README "Social preview image".
import { createRoot } from 'react-dom/client';
import '../src/styles.css';
import { OgImage } from './OgImage';

createRoot(document.getElementById('root')!).render(<OgImage />);
