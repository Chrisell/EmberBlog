class Post
  include Mongoid::Document
  field :title, type: String
  field :author, type: String
  field :intro, type: String
  field :extended, type: String
  field :publishedAt, type: Time
end
