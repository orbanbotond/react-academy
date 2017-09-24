class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  protect_from_forgery with: :null_session

  # GET /users.json
  def login
    @user = User.find_by name: params[:name]
    if @user.password == params[:password]
      render status: 200
    else
      render status: 401
    end
  end

  # POST /users.json
  def register
    if User.exists? name: params[:name]
      @user = User.new name: params[:name], password: params[:password]
      render status: 403
    else
      @user = User.create name: params[:name], password: params[:password]
      render status: 201
    end
  end

  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.json { render :show, status: :ok, location: @user }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :admin)
    end
end
