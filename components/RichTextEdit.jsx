'use client';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Button, Group, LoadingOverlay } from '@mantine/core';
import { IconDeviceFloppy, IconFileDownload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { saveReport } from '@/actions/user';

export default function RichTextEdit({ user }) {
    const [overlayVisible, overlayHandler] = useDisclosure(false);
    const [saveLoading, saveHandler] = useDisclosure(false);
    const content = user.report || `<h1 style="text-align: center">${user.first_name} ${user.middle_name} ${user.last_name}</h1><h3>personal information:</h3><ul><li><p>id: ${user.id}</p></li><li><p>Full name: ${user.first_name} ${user.middle_name} ${user.last_name}</p></li><li><p>Email: ${user.email}</p></li><li><p>Gender: ${user.gender}</p></li><li><p>DOB: <span >${user.dateOfBirth?.toDateString()}</span></p></li></ul><p></p><h3>Notes:</h3><p></p>`;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Color,
            TextStyle,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
    });

    const handleDownload = async () => {
        overlayHandler.open();
        const name = `${user.first_name} ${user.middle_name} ${user.last_name}`;
        fetch('/api/file', {
            method: "POST",
            body: JSON.stringify({ html: editor.getHTML(), name })
        }).then((response) => {
            if (response.ok) {
                response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${name}.docx`;
                    a.click();
                });
            }

        }).finally(() => {
            overlayHandler.close();
        });

    };

    const handleSave = async () => {
        saveHandler.open();
        await saveReport(user.id, editor.getHTML());
        saveHandler.close();
    };

    return (
        <>
            <RichTextEditor editor={editor} >
                <RichTextEditor.Toolbar sticky stickyOffset={60} >
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.ColorPicker
                            colors={[
                                '#25262b',
                                '#868e96',
                                '#fa5252',
                                '#e64980',
                                '#be4bdb',
                                '#7950f2',
                                '#4c6ef5',
                                '#228be6',
                                '#15aabf',
                                '#12b886',
                                '#40c057',
                                '#82c91e',
                                '#fab005',
                                '#fd7e14',
                            ]}
                        />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
                <LoadingOverlay visible={overlayVisible} overlayBlur={2} />
            </RichTextEditor>
            <Group pt={'1rem'} position='center'>

                <Button variant='outline' color='gray' rightIcon={<IconDeviceFloppy />} title='save' onClick={handleSave} loading={saveLoading} >
                    Save
                </Button>

                <Button variant='outline' color='gray' rightIcon={<IconFileDownload />} title='download' onClick={handleDownload} loading={overlayVisible} >
                    Download
                </Button>
            </Group>
        </>
    );
}