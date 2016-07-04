function fmt_sql(months){

  // select first bookings by each booker
  var first_bookings = 'SELECT bookings.booker_id,\
  MIN(bookingitems.end_timestamp) AS first_booking\
  FROM bookings\
  INNER JOIN bookingitems ON bookings.id = bookingitems.booking_id\
  WHERE bookingitems.item_id IN (\
    SELECT item_id\
    FROM spaces\
  )\
  GROUP BY bookings.booker_id'

  // get bookers & items and join it with the first_bookings
  var first_booker_data = 'SELECT first_bookings.booker_id,\
  strftime("%m-%Y", first_bookings.first_booking, "unixepoch") AS first_month,\
    SUM(bookingitems.locked_total_price) AS revenue,\
    COUNT(bookings.id) AS number_of_bookings\
  FROM ('+first_bookings+') AS first_bookings\
  INNER JOIN bookings ON first_bookings.booker_id = bookings.booker_id\
  INNER JOIN bookingitems ON bookings.id = bookingitems.booking_id\
  WHERE\
  DATE(bookingitems.end_timestamp, "unixepoch") < DATE(\
    first_bookings.first_booking,\
    "unixepoch",\
    "start of month",\
    "+'+months.toString()+' months")\
  GROUP BY first_bookings.booker_id'

  return 'SELECT first_booker_data.first_month,\
      COUNT(first_booker_data.booker_id) AS bookers_count,\
			SUM(first_booker_data.revenue) AS revenue_sum,\
      SUM(first_booker_data.number_of_bookings) AS bookings_count\
		FROM ('+first_booker_data+') AS first_booker_data\
		GROUP BY first_booker_data.first_month'
}

module.exports.fmt_sql = fmt_sql
