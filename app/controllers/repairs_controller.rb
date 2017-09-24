class RepairsController < ApplicationController
  before_action :set_repair, only: [:show, :edit, :update, :destroy, :start]
  protect_from_forgery with: :null_session

  # GET /repairs
  # GET /repairs.json
  def index
    @repairs = Repair.all
    @repairs = @repairs.where(user_id: params[:user_id]) if params[:user_id].present?
  end

  # PUT /repairs/1
  # PUT /repairs/1.json
  def start
    if Repair.where('starts_at > ?', Time.zone.now - 1.hour).where.not(id: @repair.id).exists?
      render status: 403
    else
      @repair.starts_at = Time.zone.now
      @repair.save
    end
  end

  # GET /repairs/1
  # GET /repairs/1.json
  def show
  end

  # GET /repairs/new
  def new
    @repair = Repair.new
  end

  # GET /repairs/1/edit
  def edit
  end

  # POST /repairs
  # POST /repairs.json
  def create
    @repair = Repair.new(repair_params)

    respond_to do |format|
      if @repair.save
        format.html { redirect_to @repair, notice: 'Repair was successfully created.' }
        format.json { render :show, status: :created, location: @repair }
      else
        format.html { render :new }
        format.json { render json: @repair.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /repairs/1
  # PATCH/PUT /repairs/1.json
  def update
    respond_to do |format|
      if @repair.update(repair_params)
        format.html { redirect_to @repair, notice: 'Repair was successfully updated.' }
        format.json { render :show, status: :ok, location: @repair }
      else
        format.html { render :edit }
        format.json { render json: @repair.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /repairs/1
  # DELETE /repairs/1.json
  def destroy
    @repair.destroy
    respond_to do |format|
      format.html { redirect_to repairs_url, notice: 'Repair was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_repair
      @repair = Repair.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def repair_params
      params.require(:repair).permit(:complete, :name, :user_id, :approved, :starts_at)
    end
end
