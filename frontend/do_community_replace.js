const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [oldVal, newVal] of Object.entries(replacements)) {
        content = content.split(oldVal).join(newVal);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

replaceInFile('src/features/community/screens/CommunityFeedScreen.jsx', {
    '>Community Hub<': '>{t("community.hub")}<',
    // The previous run_in_terminal gave us "Connect Â· Learn Â· Grow" because of Encoding issues. 
    // Let's match both.
    '>Connect · Learn · Grow<': '>{t("community.sub")}<',
    '>Connect Â· Learn Â· Grow<': '>{t("community.sub")}<',
    'label: "Feed"': 'label: t("community.feed")',
    'label: "Forums"': 'label: t("community.forums")',
    'label: "Leaderboard"': 'label: t("community.rank")',
    'label: "Saved"': 'label: t("community.saved")',
    'placeholder="Search posts, tags..."': 'placeholder={t("community.search")}',
    '>Sort by:<': '>{t("community.sortBy")}<',
    '>Loading community posts...<': '>{t("community.loading")}<',
    '>No posts found<': '>{t("community.noPosts")}<',
    '>Be the first to post in this category!<': '>{t("community.beFirst")}<',
    '>Topic Channels<': '>{t("community.topicChannels")}<',
    '>Top Farmers This Month<': '>{t("community.topFarmers")}<',
    '>pts<': '>{t("community.pts")}<',
    '>No saved posts yet<': '>{t("community.noSaved")}<',
    '>Tap the bookmark icon on any post to save it here<': '>{t("community.tapToSave")}<',
    '{forum.threads} threads · {forum.members.toLocaleString()} members': '{forum.threads} {t("community.threads")} · {forum.members.toLocaleString()} {t("community.members")}',
    '{forum.threads} threads Â· {forum.members.toLocaleString()} members': '{forum.threads} {t("community.threads")} Â· {forum.members.toLocaleString()} {t("community.members")}'
});
