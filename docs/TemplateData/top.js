const gameIframe = document.getElementById("game-iframe");
const gameStartContainer = document.getElementById("game-start-container");
const fullscreenButton = document.getElementById("fullscreen-button");
const startButton = document.getElementById("start-button");

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  gameStartContainer.style.display = "block";
} else {
  if (gameIframe) {
    gameIframe.src = "game-iframe.html";
  }
}
// iframeにフォーカスを当てる共通関数
const focusIframe = () => {
  setTimeout(() => {
    gameIframe.focus();
    try {
      if (gameIframe.contentWindow) {
        gameIframe.contentWindow.focus();
      }
    } catch (e) {
      console.error("iframeにフォーカスを当てるのに失敗しました:", e);
    }
  }, 100);
};

// 全画面表示をリクエストする共通関数
const requestFullscreen = async (element) => {
  if (element.requestFullscreen) {
    return await element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return await element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return await element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return await element.msRequestFullscreen();
  }
};

// 現在の全画面要素を取得する共通関数
const getFullscreenElement = () => {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

// 全画面変更イベントの共通ハンドラー
const handleFullscreenChange = () => {
  if (getFullscreenElement() === gameIframe) {
    focusIframe();
  }
};

// 各ブラウザ用の全画面変更イベントリスナー
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("MSFullscreenChange", handleFullscreenChange);

// 全画面表示ボタンのイベントリスナー
fullscreenButton.addEventListener("click", async () => {
  try {
    await requestFullscreen(gameIframe);
    focusIframe();
  } catch (error) {
    console.error("全画面表示に失敗しました:", error);
  }
});

// スタートボタンのイベントリスナー
startButton.addEventListener("click", async () => {
  location.href = "game.html";
});
