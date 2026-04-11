const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import and hook if missing
    if (!content.includes("import { useLanguage } from '../../../store/languageStore';")) {
        const importIndex = content.lastIndexOf("import ");
        const endOfImport = content.indexOf("\n", importIndex);
        content = content.slice(0, endOfImport + 1) + "import { useLanguage } from '../../../store/languageStore';\n" + content.slice(endOfImport + 1);
    }
    
    if (!content.includes('const { t } = useLanguage();')) {
        const funcIndex = content.indexOf('const CreatePostScreen = () => {');
        const braceIndex = content.indexOf('{', funcIndex);
        content = content.slice(0, braceIndex + 1) + "\n    const { t } = useLanguage();" + content.slice(braceIndex + 1);
    }

    for (const [oldVal, newVal] of Object.entries(replacements)) {
        content = content.split(oldVal).join(newVal);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

replaceInFile('src/features/community/screens/CreatePostScreen.jsx', {
    '>Create Post<': '>{t("createPost.header")}<',
    '>Problem Title<': '>{t("createPost.titleLabel")}<',
    'placeholder="E.g., Yellow spots on wheat leaves..."': 'placeholder={t("createPost.titlePlaceholder")}',
    '>Describe your problem<': '>{t("createPost.descLabel")}<',
    'placeholder="Provide details about the issue, symptoms, duration, etc."': 'placeholder={t("createPost.descPlaceholder")}',
    '>Your Name<': '>{t("createPost.authorName")}<',
    '>Your Location (City/Village)<': '>{t("createPost.location")}<',
    '>Select Category<': '>{t("createPost.categoryLabel")}<',
    '>Tags<': '>{t("createPost.tagsLabel")}<',
    '>Suggested Tags<': '>{t("createPost.suggestedTags")}<',
    '>Add Photos<': '>{t("createPost.photoLabel")}<',
    '>Add Photo<': '>{t("createPost.addPhotoBtn")}<',
    '>AI is analyzing image and suggesting tags...<': '>{t("createPost.aiTaggingLabel")}<',
    '>Submit Post<': '>{t("createPost.submitBtn")}<',
    '>Posting...<': '>{t("createPost.posting")}<',
    'Alert.alert(\'Error\', \'Please enter a title, description, and selection a category.\')': 'Alert.alert(t("createPost.alertError"), t("createPost.alertTitleReq"))',
    'Alert.alert(\'Success\', \'Post published successfully!\')': 'Alert.alert(t("createPost.alertError"), t("createPost.alertPostSuccess"))'
});
