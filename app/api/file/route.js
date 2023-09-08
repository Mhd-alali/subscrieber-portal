import { NextRequest, NextResponse, } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

/**@param {NextRequest} req  */
export async function POST(req) {
    const { html, name } = await req.json();
    const filePath = path.join(process.cwd(), 'public/files', `${name}.docx`);

    if (fs.existsSync(filePath)) fs.rmSync(filePath);

    const buffer = await HTMLtoDOCX(html);
    
    fs.writeFileSync(filePath,buffer)

    const fileStream = fs.createReadStream(filePath);

    const res = new NextResponse(fileStream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': fs.statSync(filePath).size,
            'Content-Disposition': `attachment; filename=${name}.docx`
        }
    });

    return res;
}