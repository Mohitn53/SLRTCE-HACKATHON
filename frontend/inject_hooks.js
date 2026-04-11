const fs = require('fs');

const files = [
  { path: 'src/features/auth/screens/RegisterScreen.jsx', importStr: "import { useLanguage } from '../../../store/languageStore';", func: 'export default function RegisterScreen' },
  { path: 'src/features/camera/CameraScreen.jsx', importStr: "import { useLanguage } from '../../store/languageStore';", func: 'export default function CameraScreen' },
  { path: 'src/features/detection/DetectionScreen.jsx', importStr: "import { useLanguage } from '../../store/languageStore';", func: 'export default function DetectionScreen' },
  { path: 'src/features/history/HistoryScreen.jsx', importStr: "import { useLanguage } from '../../store/languageStore';", func: 'export default function HistoryScreen' },
  { path: 'src/features/chatbot/screens/ChatbotScreen.jsx', importStr: "import { useLanguage } from '../../../store/languageStore';", func: 'export default function ChatbotScreen' },
  { path: 'src/features/soil/SoilMoistureScreen.jsx', importStr: "import { useLanguage } from '../../store/languageStore';", func: 'export default function SoilMoistureScreen' }
];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f.path, 'utf8');
    
    // 1. Inject Import
    if (!content.includes('useLanguage')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + f.importStr + '\n' + content.slice(endOfLastImport + 1);
      } else {
        content = f.importStr + '\n' + content;
      }
    }
    
    // 2. Inject Hook
    if (!content.includes('const { t } = useLanguage();')) {
      const funcIndex = content.indexOf(f.func);
      if (funcIndex !== -1) {
        const braceIndex = content.indexOf('{', funcIndex);
        if (braceIndex !== -1) {
          content = content.slice(0, braceIndex + 1) + '\n    const { t } = useLanguage();\n' + content.slice(braceIndex + 1);
        }
      }
    }
    
    fs.writeFileSync(f.path, content);
    console.log(`Injected hooks into ${f.path}`);
  } catch (err) {
    console.log(`Failed for ${f.path}: ${err.message}`);
  }
});
