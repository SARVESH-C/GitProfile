const username = process.argv[2];

 function printError(message){
    console.error(message);
        process.exitCode = 1;
    }
function printProfile(profile){
    console.log(`Name: ${profile.name || 'not Set'}`);
    console.log(`Username: ${profile.login}`);
    console.log(`Profile: ${profile.html_url}`);
    console.log(`Public repos: ${profile.public_repos}`);
    console.log(`Followers: ${profile.followers}`);
}
async function fetchGitHubProfile(username){
    const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

    let response;
    try{
        response = await fetch(url, {
            headers:{
                Accept: 'application/vnd.github+json',
                'User-Agent' : 'github-profile-cli',
            },
        });
    }catch{
        printError('could not reach GitHub');
        return null;
    }
    const data = await response.json().catch(()=> null);

    if (response.status === 404){
        printError(`GitHub user not found: ${username}`);
        return null;
    }
    if(!response.ok){
        printError(data?.message || `GitHub request failed with status ${response.status}`);
        return null;
    }
    return data;
}
    async function main(){
        if(!username){
            printError('please provide a GitHub username');
            return;
        }
        const profile = await fetchGitHubProfile(username);
        if(!profile){
            return;
        }
        printProfile(profile);

    }

await main();