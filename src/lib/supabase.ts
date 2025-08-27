import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  restaurant_name: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  uber_eats_url?: string;
  scraped_at?: string;
  menu_items_count: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price?: number;
  category: 'appetizer' | 'main' | 'dessert' | 'drink' | 'other';
  has_image: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  menu_item_id: string;
  image_url?: string;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// Database helper functions
export const db = {
  // User operations
  async createUser(email: string, restaurantName: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          restaurant_name: restaurantName,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return data;
  },

  async updateUserStatus(email: string, status: User['status']): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ status })
      .eq('email', email);

    if (error) {
      console.error('Error updating user status:', error);
      return false;
    }

    return true;
  },

  // Restaurant operations
  async createRestaurant(name: string, uberEatsUrl?: string): Promise<Restaurant | null> {
    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .insert([
        {
          name,
          uber_eats_url: uberEatsUrl,
          menu_items_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      return null;
    }

    return data;
  },

  async getRestaurantByName(name: string): Promise<Restaurant | null> {
    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .select('*')
      .ilike('name', `%${name}%`)
      .single();

    if (error) {
      console.error('Error getting restaurant:', error);
      return null;
    }

    return data;
  },

  // Menu item operations
  async createMenuItem(
    restaurantId: string,
    name: string,
    description?: string,
    price?: number,
    category: MenuItem['category'] = 'other'
  ): Promise<MenuItem | null> {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .insert([
        {
          restaurant_id: restaurantId,
          name,
          description,
          price,
          category,
          has_image: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      return null;
    }

    return data;
  },

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId);

    if (error) {
      console.error('Error getting menu items:', error);
      return [];
    }

    return data || [];
  },

  // Generated image operations
  async createGeneratedImage(
    userId: string,
    menuItemId: string
  ): Promise<GeneratedImage | null> {
    const { data, error } = await supabaseAdmin
      .from('generated_images')
      .insert([
        {
          user_id: userId,
          menu_item_id: menuItemId,
          status: 'generating',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating generated image:', error);
      return null;
    }

    return data;
  },

  async updateGeneratedImage(
    id: string,
    imageUrl: string,
    status: GeneratedImage['status']
  ): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('generated_images')
      .update({
        image_url: imageUrl,
        status,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating generated image:', error);
      return false;
    }

    return true;
  },

  async getGeneratedImagesByUser(userId: string): Promise<GeneratedImage[]> {
    const { data, error } = await supabaseAdmin
      .from('generated_images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting generated images:', error);
      return [];
    }

    return data || [];
  },
};
