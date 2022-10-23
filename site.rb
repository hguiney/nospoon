require 'sinatra/base'
require 'sinatra/subdomain'
require 'yaml'
require 'hash_dot'
require 'money'
require 'stripe'
require 'dotenv/load'
require 'yaml/store'
require 'json/minify'

# set :tld_size, 2 ?
Hash.use_dot_syntax = true
Money.locale_backend = :i18n
I18n.config.available_locales = :en
I18n.locale = :en
Stripe.api_key = ENV['STRIPE_TEST_SK']
set :show_exceptions, :after_handler

class NoSpoonProductions < Sinatra::Base
  @@supported_languages = [ :en, :ja ]

  before do
    @copy = YAML.load_file('data/language.yaml')
    @lang = File.read('data/language.json', :encoding => 'utf-8')
    @language = get_language(request.host)
    @supported_languages = @@supported_languages
    @locale = get_locale(@language)
    @currentYear = Time.now.year

    @productData = "var NoSpoonProductions = {};NoSpoonProductions.lang = #{JSON.minify(@lang)};"
    @productData.strip!
  end

  def get_locale(language)
    case language
    when 'en'
      'en-US'
    when 'ja'
      'ja-JP'
    else
      language
    end
  end

  def get_language(subdomain)
    # TODO: Loop known subdomains
    language = subdomain.to_s.sub( 'local.', '' ).sub( 'staging.', '' ).sub( '.apparel', '' )

    if @@supported_languages.include? language
      language
    else
      'en'
    end
  end

  get "/" do
    erb :index, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end

  get "/about/" do
    erb :about, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end
end