require 'rails_helper'

describe User do
  context 'fields' do
    it { should respond_to(:name) }
    it { should respond_to(:password_hash) }
    it { should respond_to(:admin?) }
  end

  context '#' do
    specify 'The password should be stored hashed' do
      user = described_class.new
      unhashed_pwd = 'New Pwd'
      user.password = unhashed_pwd
      expect(user.password_hash).to_not eq(unhashed_pwd)
      expect(user.password).to eq(unhashed_pwd)
    end
  end
end