-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    uber_eats_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE,
    menu_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('appetizer', 'main', 'dessert', 'drink', 'other')),
    has_image BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_images table
CREATE TABLE generated_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_status ON generated_images(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_images_updated_at BEFORE UPDATE ON generated_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create RLS policies for restaurants table
CREATE POLICY "Restaurants are viewable by all" ON restaurants
    FOR SELECT USING (true);

CREATE POLICY "Restaurants can be inserted by authenticated users" ON restaurants
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for menu_items table
CREATE POLICY "Menu items are viewable by all" ON menu_items
    FOR SELECT USING (true);

CREATE POLICY "Menu items can be inserted by authenticated users" ON menu_items
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for generated_images table
CREATE POLICY "Users can view their own generated images" ON generated_images
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

CREATE POLICY "Users can insert their own generated images" ON generated_images
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

CREATE POLICY "Users can update their own generated images" ON generated_images
    FOR UPDATE USING (user_id IN (
        SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

-- Create a function to get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email VARCHAR)
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    restaurant_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.restaurant_name, u.created_at, u.status
    FROM users u
    WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get restaurant menu items
CREATE OR REPLACE FUNCTION get_restaurant_menu_items(restaurant_name VARCHAR)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    price DECIMAL,
    category VARCHAR,
    has_image BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT mi.id, mi.name, mi.description, mi.price, mi.category, mi.has_image
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    WHERE r.name ILIKE '%' || restaurant_name || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
