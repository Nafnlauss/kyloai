-- SQL PARA ADICIONAR TODOS OS 40 MODELOS DA NEWPORTAI
-- Baseado na estrutura de preços fornecida

-- ====================================
-- NEWPORTAI - TODOS OS 40 MODELOS
-- ====================================

-- IMAGE GENERATOR (1 modelo)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-portrait', 'AI Portrait Generator', 'newportai', 'portrait-generator', 'AI portrait generation', 'Portrait', 0, 0, true, 
 ARRAY['Portrait generation', 'AI faces', 'Multiple styles', 'High quality'], 
 ARRAY['Portrait only', 'Fixed styles']);

-- AI CLOTHES CHANGER (4 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-clothing-matting', 'Clothing Matting', 'newportai', 'clothing-matting', 'Extract clothing from images', 'Shirt', 0, 0, true, 
 ARRAY['Clothing extraction', 'Clean edges', 'Preserve details'], 
 ARRAY['Clothing only']),

('newport-human-matting', 'Human Matting', 'newportai', 'human-matting', 'Extract humans from images', 'User', 0, 0, true, 
 ARRAY['Human extraction', 'Background removal', 'Clean edges'], 
 ARRAY['Human only']),

('newport-ai-model', 'AI Model', 'newportai', 'ai-model', 'Virtual fashion model', 'Model', 0, 0, true, 
 ARRAY['Virtual models', 'Fashion poses', 'Multiple styles'], 
 ARRAY['Fashion focused']),

('newport-ai-tryon', 'AI Try On', 'newportai', 'ai-tryon', 'Virtual clothing try-on', 'Hanger', 0, 0, true, 
 ARRAY['Virtual try-on', 'Realistic fit', 'Multiple angles', 'Fashion preview'], 
 ARRAY['Requires good input', 'Processing time']);

-- IMAGE EDITOR (10 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-remove-bg', 'Remove Background', 'newportai', 'remove-background', 'AI background removal', 'Scissors', 0, 0, true, 
 ARRAY['Background removal', 'Clean edges', 'Preserve details'], 
 ARRAY['Static images only']),

('newport-replace-bg', 'Replace Background', 'newportai', 'replace-background', 'AI background replacement', 'Replace', 0, 0, true, 
 ARRAY['Background replacement', 'Natural blending', 'Multiple backgrounds'], 
 ARRAY['Quality varies']),

('newport-enhance', 'Enhance', 'newportai', 'enhance', 'AI image enhancement', 'Sparkles', 0, 0, true, 
 ARRAY['Quality enhancement', 'Detail improvement', 'Color correction'], 
 ARRAY['Limited to 4x']),

('newport-inpainting', 'Inpainting', 'newportai', 'inpainting', 'Fill missing parts', 'Paint', 0, 0, true, 
 ARRAY['Smart fill', 'Object removal', 'Content aware'], 
 ARRAY['Requires mask']),

('newport-outpainting', 'Outpainting', 'newportai', 'outpainting', 'Extend image borders', 'Expand', 0, 0, true, 
 ARRAY['Image extension', 'Smart generation', 'Seamless blend'], 
 ARRAY['Quality varies']),

('newport-colorize', 'Colorize', 'newportai', 'colorize', 'Add color to B&W images', 'Palette', 0, 0, true, 
 ARRAY['Auto colorization', 'Natural colors', 'Historical accuracy'], 
 ARRAY['B&W input only']),

('newport-erase', 'Erase', 'newportai', 'erase', 'Smart object eraser', 'Eraser', 0, 0, true, 
 ARRAY['Object removal', 'Smart fill', 'Quick erase'], 
 ARRAY['Simple objects']),

('newport-doc-recognition', 'Document Recognition', 'newportai', 'doc-recognition', 'OCR document reader', 'Document', 0, 0, true, 
 ARRAY['OCR', 'Text extraction', 'Multiple languages', 'FREE'], 
 ARRAY['Text documents only']),

('newport-remove-stripe', 'Remove Screen Stripe', 'newportai', 'remove-stripe', 'Remove screen moiré', 'Grid', 0, 0, true, 
 ARRAY['Moiré removal', 'Screen cleanup', 'Pattern removal'], 
 ARRAY['Screen photos only']),

('newport-remove-shadow', 'Remove Picture Shadows', 'newportai', 'remove-shadow', 'Shadow removal', 'Shadow', 0, 0, true, 
 ARRAY['Shadow removal', 'Even lighting', 'Natural look'], 
 ARRAY['Hard shadows difficult']);

-- FACE EDITOR (2 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-swap-face', 'Swap Face', 'newportai', 'swap-face', 'AI face swapping', 'Faces', 0, 0, true, 
 ARRAY['Face swapping', 'Natural blend', 'Expression transfer'], 
 ARRAY['Front faces best']),

('newport-restore-face', 'Restore Face', 'newportai', 'restore-face', 'AI face restoration', 'FaceRestore', 0, 0, true, 
 ARRAY['Face restoration', 'Detail enhancement', 'Old photo repair'], 
 ARRAY['Faces only']);

-- VIDEO GENERATOR (12 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-pag-merge', 'PAG Merge', 'newportai', 'pag-merge', 'Video merging', 'Merge', 0, 0, true, 
 ARRAY['Video merging', 'Smooth transitions', 'Multiple inputs'], 
 ARRAY['Format limits']),

('newport-live-photo', 'Live Photo', 'newportai', 'live-photo', 'Animate still photos', 'Motion', 0, 0, true, 
 ARRAY['Photo animation', '3D effect', 'Cinemagraph style'], 
 ARRAY['Limited motion']),

('newport-lipsync', 'LipSync', 'newportai', 'lipsync', 'AI lip synchronization', 'Lips', 1, 300, true, 
 ARRAY['Lip sync', 'Audio matching', 'Natural movement', 'Multiple languages'], 
 ARRAY['Front faces', 'Clear audio needed']),

('newport-talking-image', 'Talking Image', 'newportai', 'talking-image', 'Make images talk', 'Speaking', 1, 60, true, 
 ARRAY['Image to video', 'Speech animation', 'Facial movement'], 
 ARRAY['Portrait images']),

('newport-text-to-video', 'Text To Video', 'newportai', 'text-to-video', 'Generate video from text', 'TextVideo', 4, 8, true, 
 ARRAY['Text to video', 'Multiple resolutions', 'Creative generation'], 
 ARRAY['4-8 seconds only']),

('newport-image-to-video', 'Image To Video', 'newportai', 'image-to-video', 'Animate images', 'ImageVideo', 4, 8, true, 
 ARRAY['Image animation', 'Motion generation', 'Scene animation'], 
 ARRAY['4-8 seconds only']),

('newport-character-to-video', 'Character To Video', 'newportai', 'character-to-video', 'Animate characters', 'Character', 4, 8, true, 
 ARRAY['Character animation', 'Motion capture', 'Action generation'], 
 ARRAY['Character focus']),

('newport-template-to-video', 'Template To Video', 'newportai', 'template-to-video', 'Template-based video', 'Template', 4, 4, true, 
 ARRAY['Template videos', 'Quick generation', 'Preset styles'], 
 ARRAY['4 seconds fixed']),

('newport-video-translate-lipsync', 'Video Translate Lip-Sync', 'newportai', 'video-translate-lipsync', 'Translate with lip sync', 'Translate', 1, 300, true, 
 ARRAY['Video translation', 'Lip sync', 'Multiple languages', 'Voice matching'], 
 ARRAY['Processing intensive']),

('newport-video-translate-voice', 'Video Translate Voice Only', 'newportai', 'video-translate-voice', 'Translate voice only', 'Voice', 1, 300, true, 
 ARRAY['Voice translation', 'Multiple languages', 'Faster than lipsync'], 
 ARRAY['No lip sync']),

('newport-swap-face-video', 'Swap Face For Video', 'newportai', 'swap-face-video', 'Face swap in videos', 'VideoFace', 1, 300, true, 
 ARRAY['Video face swap', 'Temporal consistency', 'Multiple faces'], 
 ARRAY['Front faces best']),

('newport-image-to-video-sonic', 'Image To Video Sonic', 'newportai', 'image-to-video-sonic', 'Fast image animation', 'Sonic', 1, 30, true, 
 ARRAY['Fast animation', 'Sonic speed', 'Quick results'], 
 ARRAY['Quality tradeoff']),

('newport-text-to-video-wan2', 'Text To Video Wan2.0', 'newportai', 'text-to-video-wan2', 'Wan2.0 text to video', 'Wan', 4, 4, true, 
 ARRAY['Wan2.0 model', 'High quality', 'Advanced generation'], 
 ARRAY['4 seconds only']),

('newport-image-to-video-wan2', 'Image To Video Wan2.0', 'newportai', 'image-to-video-wan2', 'Wan2.0 image to video', 'Wan', 4, 4, true, 
 ARRAY['Wan2.0 model', 'High quality', 'Advanced animation'], 
 ARRAY['4 seconds only']);

-- TEXT TO SPEECH (4 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-voice-clone', 'Voice Clone', 'newportai', 'voice-clone', 'Clone any voice', 'Microphone', 0, 0, true, 
 ARRAY['Voice cloning', 'Custom voices', 'High accuracy', 'FREE'], 
 ARRAY['Training required']),

('newport-tts-clone', 'Do TTS Clone', 'newportai', 'tts-clone', 'TTS with cloned voice', 'SpeakClone', 0, 0, true, 
 ARRAY['Cloned voice TTS', 'Natural speech', 'Emotion control'], 
 ARRAY['Requires voice clone']),

('newport-tts-common', 'Do TTS Common', 'newportai', 'tts-common', 'Standard TTS voices', 'Speak', 0, 0, true, 
 ARRAY['Standard voices', 'Multiple languages', 'Quick generation'], 
 ARRAY['Limited voices']),

('newport-tts-pro', 'Do TTS Pro', 'newportai', 'tts-pro', 'Professional TTS', 'SpeakPro', 0, 0, true, 
 ARRAY['Premium voices', 'Better quality', 'More control', 'SSML support'], 
 ARRAY['Higher cost']);

-- SPEECH TO TEXT (2 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-stt', 'Do STT', 'newportai', 'stt', 'Speech to text', 'Transcribe', 0, 0, true, 
 ARRAY['Speech recognition', 'Multiple languages', 'Punctuation'], 
 ARRAY['Audio quality dependent']),

('newport-stt-pro', 'Do STT Pro', 'newportai', 'stt-pro', 'Professional STT', 'TranscribePro', 0, 0, true, 
 ARRAY['Enhanced accuracy', 'Speaker detection', 'Timestamps', 'Better punctuation'], 
 ARRAY['Double cost']);

-- VIDEO REPLACE BACKGROUND (2 modelos)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-video-matting', 'Video Matting', 'newportai', 'video-matting', 'Extract subject from video', 'VideoMask', 1, 300, true, 
 ARRAY['Video matting', 'Clean edges', 'Temporal consistency'], 
 ARRAY['Processing time']),

('newport-composite-video', 'Composite After Video Matting', 'newportai', 'composite-video', 'Compose video backgrounds', 'Composite', 1, 300, true, 
 ARRAY['Background composition', 'Natural blend', 'Multiple backgrounds'], 
 ARRAY['Requires matting first']);

-- USER DASHBOARD (1 modelo)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('newport-credits', 'Available Credits', 'newportai', 'credits', 'Check credit balance', 'Coins', 0, 0, true, 
 ARRAY['Credit check', 'Usage history', 'Balance info', 'FREE'], 
 ARRAY['Read only']);

-- ====================================
-- FORMATOS E PREÇOS NEWPORTAI
-- ====================================

-- Formatos para imagem
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'standard', 'Standard Quality', 1024, 1024, '1:1', true 
FROM media_apis WHERE provider = 'newportai' AND model LIKE '%image%' OR model LIKE '%portrait%' OR model LIKE '%face%' OR model LIKE '%matting%' OR model LIKE '%enhance%' OR model LIKE '%paint%' OR model LIKE '%color%' OR model LIKE '%erase%' OR model LIKE '%remove%' OR model LIKE '%ai-model%' OR model LIKE '%ai-tryon%';

-- Formatos para vídeo
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
-- Text/Image/Character to Video
('newport-text-to-video', '512p', '512p Standard', 512, 512, '1:1', true),
('newport-text-to-video', '720p', '720p HD', 1280, 720, '16:9', true),
('newport-text-to-video', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('newport-image-to-video', '512p', '512p Standard', 512, 512, '1:1', true),
('newport-image-to-video', '720p', '720p HD', 1280, 720, '16:9', true),
('newport-image-to-video', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('newport-character-to-video', '512p', '512p Standard', 512, 512, '1:1', true),
('newport-character-to-video', '720p', '720p HD', 1280, 720, '16:9', true),
('newport-character-to-video', '1080p', '1080p Full HD', 1920, 1080, '16:9', true);

-- Formatos para áudio
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'audio', 'Audio', 0, 0, 'audio', true 
FROM media_apis WHERE provider = 'newportai' AND (model LIKE '%tts%' OR model LIKE '%stt%' OR model LIKE '%voice%');

-- ====================================
-- PREÇOS NEWPORTAI
-- ====================================

-- Imagem (preço fixo)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('newport-portrait', 'standard', 0, 2, 0.0056),
('newport-clothing-matting', 'standard', 0, 2, 0.0056),
('newport-human-matting', 'standard', 0, 2, 0.0056),
('newport-ai-model', 'standard', 0, 25, 0.07),
('newport-ai-tryon', 'standard', 0, 25, 0.07),
('newport-remove-bg', 'standard', 0, 2, 0.0056),
('newport-replace-bg', 'standard', 0, 2, 0.0056),
('newport-enhance', 'standard', 0, 2, 0.0056),
('newport-inpainting', 'standard', 0, 2, 0.0056),
('newport-outpainting', 'standard', 0, 2, 0.0056),
('newport-colorize', 'standard', 0, 2, 0.0056),
('newport-erase', 'standard', 0, 1, 0.0028),
('newport-doc-recognition', 'standard', 0, 0, 0),
('newport-remove-stripe', 'standard', 0, 2, 0.0056),
('newport-remove-shadow', 'standard', 0, 2, 0.0056),
('newport-swap-face', 'standard', 0, 3, 0.0084),
('newport-restore-face', 'standard', 0, 3, 0.0084);

-- Vídeo (preços variados)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- PAG Merge e Live Photo
('newport-pag-merge', 'standard', 0, 2, 0.0056),
('newport-live-photo', 'standard', 0, 6, 0.017),

-- Template (fixo 4s)
('newport-template-to-video', 'standard', 4, 20, 0.056),

-- Wan2.0 (fixo 4s)
('newport-text-to-video-wan2', 'standard', 4, 30, 0.084),
('newport-image-to-video-wan2', 'standard', 4, 30, 0.084),

-- Text/Image/Character to Video (variável)
('newport-text-to-video', '512p', 4, 20, 0.056),
('newport-text-to-video', '720p', 4, 60, 0.17),
('newport-text-to-video', '720p', 8, 120, 0.34),
('newport-text-to-video', '1080p', 4, 180, 0.51),
('newport-image-to-video', '512p', 4, 20, 0.056),
('newport-image-to-video', '720p', 4, 60, 0.17),
('newport-image-to-video', '720p', 8, 120, 0.34),
('newport-image-to-video', '1080p', 4, 180, 0.51),
('newport-character-to-video', '512p', 4, 20, 0.056),
('newport-character-to-video', '720p', 4, 60, 0.17),
('newport-character-to-video', '720p', 8, 120, 0.34),
('newport-character-to-video', '1080p', 4, 180, 0.51);

-- Por segundo (usar duration = 1 para representar por segundo)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('newport-lipsync', 'standard', 1, 1, 0.0028),
('newport-talking-image', 'standard', 1, 2, 0.0056),
('newport-video-translate-lipsync', 'standard', 1, 3, 0.0084),
('newport-video-translate-voice', 'standard', 1, 2, 0.0056),
('newport-swap-face-video', 'standard', 1, 1, 0.0028),
('newport-image-to-video-sonic', 'standard', 1, 4, 0.011),
('newport-video-matting', 'standard', 1, 1, 0.0028),
('newport-composite-video', 'standard', 10, 1, 0.0028);

-- TTS (por caracteres - duration = 250 ou 200)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('newport-voice-clone', 'audio', 0, 0, 0),
('newport-tts-clone', 'audio', 250, 1, 0.0028),
('newport-tts-common', 'audio', 250, 1, 0.0028),
('newport-tts-pro', 'audio', 200, 1, 0.0028);

-- STT (por minuto - duration = 60)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('newport-stt', 'audio', 60, 1, 0.0028),
('newport-stt-pro', 'audio', 60, 2, 0.0056);

-- Dashboard
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('newport-credits', 'standard', 0, 0, 0);

-- ====================================
-- ESTATÍSTICAS FINAIS
-- ====================================
SELECT 
    'Total NewportAI' as info,
    COUNT(*) as total
FROM media_apis
WHERE provider = 'newportai';