const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./rent-management-frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove blurs
    content = content.replace(/backdrop-blur-[a-z0-9\-]+/g, '');
    
    // Remove mix-blend multiply bubbles
    // Example: <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 mix-blend-multiply pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
    content = content.replace(/<div[^>]*blur-\[\d+px\][^>]*><\/div>/g, '');

    // Simplify backgrounds
    content = content.replace(/bg-white\/\d+/g, 'bg-white');
    content = content.replace(/bg-slate-800\/\d+/g, 'bg-slate-800');
    content = content.replace(/bg-slate-900\/\d+/g, 'bg-slate-900');
    content = content.replace(/bg-slate-200\/\d+/g, 'bg-slate-200');
    content = content.replace(/bg-slate-50\/\d+/g, 'bg-slate-50');
    content = content.replace(/bg-slate-100\/\d+/g, 'bg-slate-100');

    // Simplify borders
    content = content.replace(/border-slate-[0-9]+\/\d+/g, (match) => match.split('/')[0]);
    content = content.replace(/border-indigo-[0-9]+\/\d+/g, (match) => match.split('/')[0]);

    // Simplify rounded corners
    content = content.replace(/rounded-3xl/g, 'rounded-xl');
    content = content.replace(/rounded-2xl/g, 'rounded-lg');

    // Remove odd shadow colors
    content = content.replace(/shadow-[a-z]+-[0-9]+\/\d+/g, '');
    
    // Simplify text and rings
    content = content.replace(/ring-[a-z]+-[0-9]+\/\d+/g, (match) => match.split('/')[0]);
    content = content.replace(/text-slate-[0-9]+\/\d+/g, (match) => match.split('/')[0]);

    // Multiple spaces cleanup
    content = content.replace(/ +(?= )/g,'');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned up: ${file}`);
    }
});
