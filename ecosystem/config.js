module.exports = {
  apps: [
    {
      name: "shulebot",
      script: "src/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      },
      watch: false,
      max_memory_restart: "512M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
