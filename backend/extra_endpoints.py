# extra_endpoints.py
from flask import request, jsonify
from psycopg2.extras import RealDictCursor
from script import app, get_db_connection

# ===============================
# 1️⃣ Batter Line-Length Analysis
# ===============================
@app.route('/api/batter-line-length')
def get_batter_line_length():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            line,
            length,
            SUM(CAST(batruns AS INTEGER)) AS total_runs,
            COUNT(*) AS balls_faced
        FROM ipl_matches
        WHERE bat = %s
        GROUP BY line, length
        ORDER BY total_runs DESC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)


# ====================================
# 2️⃣ Batter Line-Length Strike Rate
# ====================================
@app.route('/api/batter-line-length-sr')
def get_batter_line_length_sr():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            line,
            length,
            SUM(CAST(batruns AS INTEGER)) AS total_runs,
            COUNT(*) AS balls_faced,
            ROUND(
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE CAST(SUM(CAST(batruns AS FLOAT)) / COUNT(*) * 100 AS NUMERIC)
                END, 2
            ) AS strike_rate
        FROM ipl_matches
        WHERE bat = %s
        GROUP BY line, length
        ORDER BY strike_rate DESC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)


# ===============================
# 3️⃣ Batter Shot Type Analysis
# ===============================
@app.route('/api/batter-shot-types')
def get_batter_shot_types():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            shot_type,
            SUM(CAST(batruns AS INTEGER)) AS total_runs,
            COUNT(*) AS balls_faced,
            ROUND(
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE CAST(SUM(CAST(batruns AS FLOAT)) / COUNT(*) * 100 AS NUMERIC)
                END, 2
            ) AS strike_rate
        FROM ipl_matches
        WHERE bat = %s
        GROUP BY shot_type
        ORDER BY total_runs DESC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)


# ===============================
# 4️⃣ Bowler Line-Length Analysis
# ===============================
@app.route('/api/bowler-line-length')
def get_bowler_line_length():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            line,
            length,
            COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END) AS wickets,
            SUM(CAST(bowlruns AS INTEGER)) AS runs_conceded,
            ROUND(
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(*) / 6.0, 0) AS NUMERIC)
                END, 2
            ) AS economy
        FROM ipl_matches
        WHERE bowl = %s
        GROUP BY line, length
        ORDER BY wickets DESC, economy ASC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)


# =================================
# 5️⃣ Extended Batting Stats
# =================================
@app.route('/api/batting-stats-extended')
def get_batting_stats_extended():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            team_bowl AS opponent,
            SUM(CAST(batruns AS INTEGER)) AS total_runs,
            COUNT(CASE WHEN outcome = 'out' THEN 1 END) AS dismissals,
            ROUND(
                CASE 
                    WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) = 0 THEN SUM(CAST(batruns AS FLOAT))
                    ELSE SUM(CAST(batruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' THEN 1 END)
                END, 2
            ) AS average,
            ROUND(
                CASE 
                    WHEN SUM(CAST(ballfaced AS FLOAT)) = 0 THEN 0
                    ELSE SUM(CAST(batruns AS FLOAT)) / SUM(CAST(ballfaced AS FLOAT)) * 100
                END, 2
            ) AS strike_rate
        FROM ipl_matches
        WHERE bat = %s
        GROUP BY team_bowl
        ORDER BY total_runs DESC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)


# =================================
# 6️⃣ Extended Bowling Stats
# =================================
@app.route('/api/bowling-stats-extended')
def get_bowling_stats_extended():
    player = request.args.get('player')
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            team_bat AS opponent,
            COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END) AS wickets,
            SUM(CAST(bowlruns AS INTEGER)) AS runs_conceded,
            ROUND(
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(*) / 6.0, 0) AS NUMERIC)
                END, 2
            ) AS economy,
            ROUND(
                CASE 
                    WHEN COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END) = 0 THEN 0
                    ELSE SUM(CAST(bowlruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END)
                END, 2
            ) AS bowling_average
        FROM ipl_matches
        WHERE bowl = %s
        GROUP BY team_bat
        ORDER BY wickets DESC
    """, (player,))

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data)
