import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function uploadImage(file, bucket = 'menu-images') {
  if (!isSupabaseConfigured) {
    // Return base64 data URL for local testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          publicUrl: reader.result,
          error: null
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { publicUrl, error: null };
  } catch (err) {
    console.error('Storage upload error:', err);
    return { publicUrl: null, error: err };
  }
}
