
import tools from './tools.json';

// @ts-ignore
export async function load({ route, url }) {
    console.log('Route:', route);  // Add this
    console.log('URL:', url);      // Add this
    const meta = getMeta(route, url);
    console.log('Meta:', meta);    // Add this
    return {
        tools: tools,
        meta: meta
    };
}

// @ts-ignore
function getMeta(route, url) {
    if (route.id && route.id.includes("(tools)")) {
        // @ts-ignore
        let tool = tools[url.pathname.replace("/", "")];
        console.log('Tool:', tool);  // Add this
        if (tool) {
            return {
                title: tool.name,
                description: tool.description,
                contributors: tool.contributors
            };
        } else {
            console.error('Tool not found for path:', url.pathname.replace("/", ""));
            return {
                title: 'Unknown Tool',
                description: '',
                contributors: []
            };
        }
    }
    return 0;
}
