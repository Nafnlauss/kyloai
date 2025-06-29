-- SQL PARTE 2 - APENAS DADOS DA NEWPORTAI (40 modelos)
-- Execute este DEPOIS do arquivo anterior

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
-- FORMATOS E PREÇOS - CONTINUAÇÃO
-- ====================================

-- Executar o resto do SQL de formatos e preços do arquivo anterior...

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_media_apis_provider ON media_apis(provider);
CREATE INDEX IF NOT EXISTS idx_media_apis_active ON media_apis(is_active);
CREATE INDEX IF NOT EXISTS idx_media_formats_api ON media_formats(api_id);
CREATE INDEX IF NOT EXISTS idx_media_pricing_lookup ON media_pricing(api_id, format_value, duration);
CREATE INDEX IF NOT EXISTS idx_media_aspect_ratios_api ON media_aspect_ratios(api_id);

-- Verificar total de modelos inseridos
SELECT 
    provider,
    COUNT(*) as total_models,
    STRING_AGG(name, ', ' ORDER BY name) as models
FROM media_apis
WHERE is_active = true
GROUP BY provider
ORDER BY provider;

-- Total geral
SELECT COUNT(*) as total_models FROM media_apis WHERE is_active = true;