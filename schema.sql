--
-- PostgreSQL database dump
--

\restrict rxN970Pcp9QbzKKRQZz3kqJKj060EmEHnvrcs70xVu09MYR5EpQSkvJSqkWF3tq

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    brand text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type text,
    created_at timestamp without time zone DEFAULT now(),
    series text,
    image_url text,
    status text DEFAULT 'approved'::text NOT NULL,
    created_by integer,
    resistance_profile text DEFAULT 'constant'::text
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- Name: equipment_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.equipment_categories OWNER TO postgres;

--
-- Name: equipment_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipment_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipment_categories_id_seq OWNER TO postgres;

--
-- Name: equipment_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipment_categories_id_seq OWNED BY public.equipment_categories.id;


--
-- Name: equipment_favourites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_favourites (
    user_id integer NOT NULL,
    equipment_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT equipment_favourites_user_equipment_unique UNIQUE (user_id, equipment_id)
);


ALTER TABLE public.equipment_favourites OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipment_id_seq OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;


--
-- Name: equipment_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_ratings (
    user_id integer NOT NULL,
    equipment_id integer NOT NULL,
    rating integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT equipment_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.equipment_ratings OWNER TO postgres;

--
-- Name: gym_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gym_equipment (
    id integer NOT NULL,
    gym_id integer NOT NULL,
    equipment_id integer NOT NULL,
    quantity integer DEFAULT 1,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    status text DEFAULT 'approved'::text,
    created_by integer
);


ALTER TABLE public.gym_equipment OWNER TO postgres;

--
-- Name: gym_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gym_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gym_equipment_id_seq OWNER TO postgres;

--
-- Name: gym_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gym_equipment_id_seq OWNED BY public.gym_equipment.id;


--
-- Name: gym_favourites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gym_favourites (
    user_id integer NOT NULL,
    gym_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.gym_favourites OWNER TO postgres;

--
-- Name: gym_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gym_ratings (
    user_id integer,
    gym_id integer NOT NULL,
    rating integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT gym_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.gym_ratings OWNER TO postgres;

--
-- Name: gyms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gyms (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    address text,
    city text,
    country text,
    latitude double precision,
    longitude double precision,
    created_at timestamp without time zone DEFAULT now(),
    instagram character varying(255),
    image_url text,
    status text DEFAULT 'approved'::text NOT NULL,
    created_by integer
);


ALTER TABLE public.gyms OWNER TO postgres;

--
-- Name: gyms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gyms_id_seq OWNER TO postgres;

--
-- Name: gyms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gyms_id_seq OWNED BY public.gyms.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    type text NOT NULL,
    message text NOT NULL,
    related_id integer,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.test OWNER TO postgres;

--
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_id_seq OWNER TO postgres;

--
-- Name: test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_id_seq OWNED BY public.test.id;


--
-- Name: user_best_in_class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_best_in_class (
    id integer NOT NULL,
    user_id integer,
    category_id integer,
    equipment_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_best_in_class OWNER TO postgres;

--
-- Name: user_best_in_class_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_best_in_class_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_best_in_class_id_seq OWNER TO postgres;

--
-- Name: user_best_in_class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_best_in_class_id_seq OWNED BY public.user_best_in_class.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    role text DEFAULT 'user'::text NOT NULL,
    username character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);


--
-- Name: equipment_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_categories ALTER COLUMN id SET DEFAULT nextval('public.equipment_categories_id_seq'::regclass);


--
-- Name: gym_equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment ALTER COLUMN id SET DEFAULT nextval('public.gym_equipment_id_seq'::regclass);


--
-- Name: gyms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms ALTER COLUMN id SET DEFAULT nextval('public.gyms_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: test id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test ALTER COLUMN id SET DEFAULT nextval('public.test_id_seq'::regclass);


--
-- Name: user_best_in_class id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class ALTER COLUMN id SET DEFAULT nextval('public.user_best_in_class_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: equipment_categories equipment_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_categories
    ADD CONSTRAINT equipment_categories_pkey PRIMARY KEY (id);


--
-- Name: equipment_categories equipment_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_categories
    ADD CONSTRAINT equipment_categories_slug_key UNIQUE (slug);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- Name: equipment equipment_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_slug_key UNIQUE (slug);


--
-- Name: gym_equipment gym_equipment_gym_id_equipment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment
    ADD CONSTRAINT gym_equipment_gym_id_equipment_id_key UNIQUE (gym_id, equipment_id);


--
-- Name: gym_equipment gym_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment
    ADD CONSTRAINT gym_equipment_pkey PRIMARY KEY (id);


--
-- Name: gyms gyms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms
    ADD CONSTRAINT gyms_pkey PRIMARY KEY (id);


--
-- Name: gyms gyms_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms
    ADD CONSTRAINT gyms_slug_key UNIQUE (slug);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: equipment_ratings unique_user_equipment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_ratings
    ADD CONSTRAINT unique_user_equipment UNIQUE (user_id, equipment_id);


--
-- Name: user_best_in_class user_best_in_class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class
    ADD CONSTRAINT user_best_in_class_pkey PRIMARY KEY (id);


--
-- Name: user_best_in_class user_best_in_class_user_id_category_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class
    ADD CONSTRAINT user_best_in_class_user_id_category_id_key UNIQUE (user_id, category_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id, read, created_at DESC);


--
-- Name: one_rating_per_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_rating_per_user ON public.gym_ratings USING btree (user_id, gym_id);


--
-- Name: equipment equipment_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: gym_equipment gym_equipment_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment
    ADD CONSTRAINT gym_equipment_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: gym_equipment gym_equipment_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment
    ADD CONSTRAINT gym_equipment_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON DELETE CASCADE;


--
-- Name: gym_equipment gym_equipment_gym_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gym_equipment
    ADD CONSTRAINT gym_equipment_gym_id_fkey FOREIGN KEY (gym_id) REFERENCES public.gyms(id) ON DELETE CASCADE;


--
-- Name: gyms gyms_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gyms
    ADD CONSTRAINT gyms_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_best_in_class user_best_in_class_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class
    ADD CONSTRAINT user_best_in_class_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.equipment_categories(id);


--
-- Name: user_best_in_class user_best_in_class_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class
    ADD CONSTRAINT user_best_in_class_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id);


--
-- Name: user_best_in_class user_best_in_class_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_best_in_class
    ADD CONSTRAINT user_best_in_class_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rxN970Pcp9QbzKKRQZz3kqJKj060EmEHnvrcs70xVu09MYR5EpQSkvJSqkWF3tq

