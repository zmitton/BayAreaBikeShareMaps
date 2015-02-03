module ApplicationHelper
  def holiday_season?
    Time.now.month > 10
  end
end
